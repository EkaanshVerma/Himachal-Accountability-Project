import os

def add_monsoon_layer(filename):
    if not os.path.exists(filename):
        return
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add button
    old_buttons = '''        <button class="viz-btn" data-mode="bubbles">Bubbles</button>
        <button class="viz-btn" data-mode="grievances">Grievances & RTI</button>'''
    new_buttons = '''        <button class="viz-btn" data-mode="bubbles">Bubbles</button>
        <button class="viz-btn" data-mode="grievances">Grievances & RTI</button>
        <button class="viz-btn" data-mode="monsoon">Monsoon Alerts</button>'''
    if 'data-mode="monsoon"' not in content:
        content = content.replace(old_buttons, new_buttons)

    # 2. Add monsoonLayer var
    old_vars = '''let geoLayer=null, bubbleLayer=null, overlayGroup=null, labelGroup=null;'''
    new_vars = '''let geoLayer=null, bubbleLayer=null, overlayGroup=null, labelGroup=null, monsoonLayer=null;'''
    if 'monsoonLayer=null' not in content:
        content = content.replace(old_vars, new_vars)

    # 3. Add to clearLayers
    old_clear = '''if(typeof grievanceCluster !== 'undefined' && grievanceCluster){map.removeLayer(grievanceCluster);grievanceCluster=null;}'''
    new_clear = '''if(typeof grievanceCluster !== 'undefined' && grievanceCluster){map.removeLayer(grievanceCluster);grievanceCluster=null;}
  if(typeof monsoonLayer !== 'undefined' && monsoonLayer){map.removeLayer(monsoonLayer);monsoonLayer=null;}'''
    if 'monsoonLayer=null;}' not in content:
        content = content.replace(old_clear, new_clear)

    # 4. Modify renderDistricts for monsoon map
    old_districts_if = '''  } else if(mapMode==="grievances") {
    geoLayer=L.geoJSON(HP_GEOJSON,{
      style:{fillColor:"#1e2a1e",fillOpacity:0.5,color:"#3a5a3a",weight:1},
      onEachFeature:onEachDistrict
    }).addTo(map);
  }'''
    new_districts_if = '''  } else if(mapMode==="grievances") {
    geoLayer=L.geoJSON(HP_GEOJSON,{
      style:{fillColor:"#1e2a1e",fillOpacity:0.5,color:"#3a5a3a",weight:1},
      onEachFeature:onEachDistrict
    }).addTo(map);
  } else if(mapMode==="monsoon") {
    geoLayer=L.geoJSON(HP_GEOJSON,{
      style:f=>{
        const highRisk = ["Kullu", "Mandi", "Chamba", "Kinnaur", "Lahaul & Spiti"].includes(f.properties.name);
        return {fillColor: highRisk ? "#991b1b" : "#1e2a1e", fillOpacity: highRisk ? 0.6 : 0.4, color: highRisk ? "#ef4444" : "#3a5a3a", weight: highRisk ? 2 : 1};
      },
      onEachFeature:onEachDistrict
    }).addTo(map);
  }'''
    if 'mapMode==="monsoon"' not in content:
        content = content.replace(old_districts_if, new_districts_if)

    # 5. Add renderMonsoon function and update toggles
    old_toggle = '''    if(currentTab==="districts"){
      renderDistricts();
      if(mapMode==="grievances") renderGrievances();
    }'''
    new_toggle = '''    if(currentTab==="districts"){
      renderDistricts();
      if(mapMode==="grievances") renderGrievances();
      if(mapMode==="monsoon") renderMonsoon();
    }'''
    content = content.replace(old_toggle, new_toggle)

    render_monsoon_func = '''
function renderMonsoon() {
  if(typeof monsoonLayer !== 'undefined' && monsoonLayer){map.removeLayer(monsoonLayer);monsoonLayer=null;}
  monsoonLayer = L.layerGroup().addTo(map);
  
  const alerts = [
    {lat: 31.95, lon: 77.15, text: "NH-3 Mandi-Kullu blocked due to major landslide near Pandoh.", type: "landslide"},
    {lat: 32.25, lon: 76.32, text: "Flash flood warning in Dharamshala region.", type: "flood"},
    {lat: 31.55, lon: 78.25, text: "Kinnaur highway vulnerable to rockfalls.", type: "rockfall"},
    {lat: 31.10, lon: 77.16, text: "Shimla urban tree-fall hazards reported.", type: "wind"}
  ];

  alerts.forEach(alert => {
    let iconHTML = '';
    if (alert.type === 'landslide') iconHTML = '⛰️';
    else if (alert.type === 'flood') iconHTML = '🌊';
    else if (alert.type === 'rockfall') iconHTML = '🪨';
    else iconHTML = '⚠️';

    const icon = L.divIcon({
      className: 'monsoon-alert-icon',
      html: `<div style="font-size:24px; background:rgba(255,255,255,0.9); border:2px solid #ef4444; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px rgba(239,68,68,0.8);">${iconHTML}</div>`,
      iconSize: L.point(36, 36)
    });
    
    const marker = L.marker([alert.lat, alert.lon], { icon }).addTo(monsoonLayer);
    marker.bindPopup(`<div style="font-family:Inter,sans-serif; color:#111;">
        <h4 style="margin:0 0 5px 0; color:#b91c1c;">Monsoon Alert</h4>
        <p style="margin:0; font-size:13px;">${alert.text}</p>
        <button style="margin-top:8px; background:#b91c1c; color:#fff; border:none; border-radius:4px; padding:4px 8px; cursor:pointer; width:100%;">Share Alert to WhatsApp</button>
    </div>`);
  });
}
'''
    if 'function renderMonsoon()' not in content:
        # insert before renderGrievances
        content = content.replace('function renderGrievances() {', render_monsoon_func + '\nfunction renderGrievances() {')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Added Monsoon Layer to {filename}")

add_monsoon_layer('dashboard.html')
add_monsoon_layer('himachal_dashboard_v2.html')
