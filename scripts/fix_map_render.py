import os

def fix_file(filename):
    if not os.path.exists(filename):
        return
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update clearLayers
    old_clearLayers = '''function clearLayers(){
  if(geoLayer){map.removeLayer(geoLayer);geoLayer=null;}
  if(bubbleLayer){bubbleLayer.forEach(l=>map.removeLayer(l));bubbleLayer=null;}
  if(overlayGroup){map.removeLayer(overlayGroup);overlayGroup=null;}
  if(labelGroup){map.removeLayer(labelGroup);labelGroup=null;}
}'''
    new_clearLayers = '''function clearLayers(){
  if(geoLayer){map.removeLayer(geoLayer);geoLayer=null;}
  if(bubbleLayer){bubbleLayer.forEach(l=>map.removeLayer(l));bubbleLayer=null;}
  if(overlayGroup){map.removeLayer(overlayGroup);overlayGroup=null;}
  if(labelGroup){map.removeLayer(labelGroup);labelGroup=null;}
  if(typeof grievanceCluster !== 'undefined' && grievanceCluster){map.removeLayer(grievanceCluster);grievanceCluster=null;}
}'''
    content = content.replace(old_clearLayers, new_clearLayers)

    # 2. Update renderDistricts if block
    old_renderDistricts_if = '''  if(mapMode==="heat"){
    geoLayer=L.geoJSON(HP_GEOJSON,{
      style:f=>{const d=DISTRICT_DATA[f.properties.name]||{count:0};return{fillColor:getColor(d.count),fillOpacity:getOpacity(d.count),color:"#444",weight:1,opacity:0.8};},
      onEachFeature:onEachDistrict
    }).addTo(map);
  } else {
    geoLayer=L.geoJSON(HP_GEOJSON,{
      style:{fillColor:"#1e2a1e",fillOpacity:0.5,color:"#3a5a3a",weight:1},
      onEachFeature:onEachDistrict
    }).addTo(map);
    bubbleLayer=[];
    HP_GEOJSON.features.forEach(f=>{
      const name=f.properties.name;const d=DISTRICT_DATA[name]||{count:0};const c=f.properties.centroid;
      if(!c||!d.count)return;
      const r=6+(d.count/maxCount)*28;
      const circle=L.circleMarker([c[1],c[0]],{radius:r,fillColor:"#ef4444",fillOpacity:0.5+(d.count/maxCount)*0.4,color:"#ef4444",weight:1,opacity:0.9}).addTo(map);
      circle.bindPopup(distPopupHTML(name,d));
      bubbleLayer.push(circle);
    });
  }'''
    new_renderDistricts_if = '''  if(mapMode==="heat"){
    geoLayer=L.geoJSON(HP_GEOJSON,{
      style:f=>{const d=DISTRICT_DATA[f.properties.name]||{count:0};return{fillColor:getColor(d.count),fillOpacity:getOpacity(d.count),color:"#444",weight:1,opacity:0.8};},
      onEachFeature:onEachDistrict
    }).addTo(map);
  } else if(mapMode==="bubbles") {
    geoLayer=L.geoJSON(HP_GEOJSON,{
      style:{fillColor:"#1e2a1e",fillOpacity:0.5,color:"#3a5a3a",weight:1},
      onEachFeature:onEachDistrict
    }).addTo(map);
    bubbleLayer=[];
    HP_GEOJSON.features.forEach(f=>{
      const name=f.properties.name;const d=DISTRICT_DATA[name]||{count:0};const c=f.properties.centroid;
      if(!c||!d.count)return;
      const r=6+(d.count/maxCount)*28;
      const circle=L.circleMarker([c[1],c[0]],{radius:r,fillColor:"#ef4444",fillOpacity:0.5+(d.count/maxCount)*0.4,color:"#ef4444",weight:1,opacity:0.9}).addTo(map);
      circle.bindPopup(distPopupHTML(name,d));
      bubbleLayer.push(circle);
    });
  } else if(mapMode==="grievances") {
    geoLayer=L.geoJSON(HP_GEOJSON,{
      style:{fillColor:"#1e2a1e",fillOpacity:0.5,color:"#3a5a3a",weight:1},
      onEachFeature:onEachDistrict
    }).addTo(map);
  }'''
    content = content.replace(old_renderDistricts_if, new_renderDistricts_if)

    # 3. Update tab toggles
    old_toggle_1 = '''    if(currentTab==="districts"){
      if(mapMode==="grievances") renderGrievances();
      else renderDistricts();
    }'''
    new_toggle_1 = '''    if(currentTab==="districts"){
      renderDistricts();
      if(mapMode==="grievances") renderGrievances();
    }'''
    content = content.replace(old_toggle_1, new_toggle_1)

    # 4. Update renderGrievances
    old_renderG = '''function renderGrievances() {
  clearMap();
  
  // Create Marker Cluster Group'''
    new_renderG = '''function renderGrievances() {
  if(typeof grievanceCluster !== 'undefined' && grievanceCluster){map.removeLayer(grievanceCluster);grievanceCluster=null;}
  
  // Create Marker Cluster Group'''
    content = content.replace(old_renderG, new_renderG)

    # 5. Update marker to circleMarker
    old_marker = '''    // Red circle for isolated critical pins
    let iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
    const marker = L.marker([item.lat, item.lon], { upvotes: currentUpvotes });'''
    new_marker = '''    // Circle marker for isolated pins (avoids Leaflet default image 404s)
    const marker = L.circleMarker([item.lat, item.lon], { 
        radius: 8, fillColor: '#eab308', color: '#fff', weight: 2, fillOpacity: 0.9,
        upvotes: currentUpvotes 
    });'''
    content = content.replace(old_marker, new_marker)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed map logic in {filename}")

fix_file('dashboard.html')
fix_file('himachal_dashboard_v2.html')
