import os
import json

def update_file(filename):
    if not os.path.exists(filename):
        return
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update CSS links
    css_old = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>'
    css_new = '''<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css" />'''
    content = content.replace(css_old, css_new)

    # 2. Update JS script links
    js_old = '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>'
    js_new = '''<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>'''
    content = content.replace(js_old, js_new)

    # 3. Add Custom CSS
    custom_css = '''
.critical-cluster {
  background-color: rgba(239, 68, 68, 0.6);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}
.critical-cluster div {
  background-color: rgba(220, 38, 38, 0.9);
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 2px solid #fecaca;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
.pin-popup { font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; }
.pin-title { font-weight: bold; margin-bottom: 5px; }
.pin-meta { font-size: 0.8rem; color: #555; margin-bottom: 10px; }
.pin-upvotes { font-weight: bold; color: #dc2626; margin-bottom: 10px; display:flex; align-items:center; gap:5px; }
.pin-actions { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #ddd; padding-top: 10px; }
.pin-input { padding: 6px; border: 1px solid #ccc; border-radius: 4px; font-size: 0.85rem; width:100%;}
.btn-upvote { background: #1E2A22; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-weight:600;}
.btn-upvote:hover { background: #283740; }
.btn-rti { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; padding: 6px; border-radius: 4px; cursor: pointer; font-weight:600;}
.btn-rti:hover { background: #fde68a; }
</style>'''
    content = content.replace("</style>", custom_css)

    # 4. Add Grievances button
    btn_old = '<button class="viz-btn" data-mode="bubbles">Bubbles</button>'
    btn_new = '<button class="viz-btn" data-mode="bubbles">Bubbles</button>\n          <button class="viz-btn" data-mode="grievances" style="color:var(--urgent);">Grievances & RTI</button>'
    content = content.replace(btn_old, btn_new)

    # 5. Add Weather Layer Checkbox
    layer_old = '<label class="layer-toggle"><input type="checkbox" id="layer-tehsil" checked> Tehsils</label>'
    layer_new = '<label class="layer-toggle"><input type="checkbox" id="layer-tehsil" checked> Tehsils</label>\n        <label class="layer-toggle" style="color:#b91c1c;"><input type="checkbox" id="layer-weather"> ⚠️ Hazard/Landslides</label>'
    content = content.replace(layer_old, layer_new)

    # 6. Replace FEED_ITEMS with robust data
    feed_old = 'const FEED_ITEMS = [\n  {text:"Shimla (IGMC Eye OPD) — Token system not working. Doctors unresponsive. Head of department deflected complaint.",district:"Shimla",cat:"health",time:"New"},'
    feed_new = '''const FEED_ITEMS = [
  {id:"igmc-1", lat:31.107, lon:77.181, upvotes:48, dept:"Health Dept", contractor:"N/A", text:"Shimla (IGMC Eye OPD) — Token system not working. Doctors unresponsive. Head of department deflected complaint.",district:"Shimla",cat:"health",time:"New"},
  {id:"sulah-1", lat:32.11, lon:76.54, upvotes:12, dept:"Revenue Dept", contractor:"Local Kanungo", text:"Sulah (Village Kharauth) — Panchayat road blocked for over 8 months due to Kanungo-level bias and revenue record discrepancies. Section 152 BNSS orders ignored.",district:"Kangra",cat:"roads",time:"New"},
  {id:"bharmour-1", lat:32.45, lon:76.53, upvotes:501, dept:"PWD NHAI", contractor:"GVK Infra (Alleged)", text:"Bharmour (Dharwala) — NH-154A collapsed at Dharwala after spring rain. Connects Bharmour/Holi region to health infrastructure. No repair done.",district:"Chamba",cat:"roads",time:"New"},
  {id:"nadaun-1", lat:31.78, lon:76.35, upvotes:56, dept:"PWD", contractor:"Sharma Builders", text:"Nadaun (Majhin) — Broken road from Majhin Chowk to Majhin. Delayed and stalled PWD Gaushala road project.",district:"Hamirpur",cat:"roads",time:"New"},
  {id:"gagret-1", lat:31.68, lon:76.05, upvotes:89, dept:"Health Dept", contractor:"ABC Constructions", text:"Gagret — Gagret Civil Hospital work on hold for 5-7 years despite construction. Feuds over land demarcations.",district:"Una",cat:"health",time:"New"},
  {id:"kasauli-1", lat:30.9, lon:76.97, upvotes:210, dept:"MC Kasauli", contractor:"N/A", text:"Kasauli — Encroachments on pavements make walking impossible. Cyclic path and village connectivity blocked.",district:"Solan",cat:"roads",time:"New"},'''
    content = content.replace(feed_old, feed_new)

    # Also update the FEED_ITEMS in himachal_dashboard_v2 if we missed the first replace
    if feed_old not in content:
        # Try generic replacement
        pass

    # 7. Add map logic
    map_logic_old = 'if(currentTab==="districts")renderDistricts();'
    map_logic_new = '''if(currentTab==="districts"){
      if(mapMode==="grievances") renderGrievances();
      else renderDistricts();
    }'''
    content = content.replace(map_logic_old, map_logic_new)

    render_fn = '''
let grievanceCluster;
let hazardLayer;

function renderGrievances() {
  clearMap();
  
  // Create Marker Cluster Group
  grievanceCluster = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
      const markers = cluster.getAllChildMarkers();
      let totalUpvotes = 0;
      markers.forEach(m => totalUpvotes += (m.options.upvotes || 0));
      
      let c = ' marker-cluster-small';
      let html = '<div><span>' + markers.length + '</span></div>';
      
      if(totalUpvotes >= 50) {
        return L.divIcon({ html: '<div>' + totalUpvotes + ' 🔥</div>', className: 'critical-cluster', iconSize: L.point(40, 40) });
      }
      return L.divIcon({ html: html, className: 'marker-cluster' + c, iconSize: L.point(40, 40) });
    }
  });

  // LocalStorage upvotes
  const localUpvotes = JSON.parse(localStorage.getItem('hap_upvotes') || '{}');

  FEED_ITEMS.forEach(item => {
    if(!item.lat) return;
    const currentUpvotes = localUpvotes[item.id] !== undefined ? localUpvotes[item.id] : item.upvotes;
    
    // Create popup HTML
    const popupHTML = `
      <div class="pin-popup">
        <div class="pin-title">${item.cat.toUpperCase()} Issue</div>
        <div class="pin-meta"><b>Dept:</b> ${item.dept || 'Unknown'} <br> <b>Contractor:</b> ${item.contractor || 'Unknown'}</div>
        <div style="margin-bottom:8px;">${item.text}</div>
        <div class="pin-upvotes" id="upvote-count-${item.id}">${currentUpvotes} Neighbors face this</div>
        <div class="pin-actions">
          <input type="text" id="pin-${item.id}" class="pin-input" placeholder="Enter PIN code to upvote" maxlength="6">
          <button class="btn-upvote" onclick="handleUpvote('${item.id}')">I face this too</button>
          <button class="btn-rti" onclick="generateRTI('${item.id}')">Generate RTI Draft</button>
        </div>
      </div>
    `;

    // Red circle for isolated critical pins
    let iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
    const marker = L.marker([item.lat, item.lon], { upvotes: currentUpvotes });
    marker.bindPopup(popupHTML);
    grievanceCluster.addLayer(marker);
  });

  map.addLayer(grievanceCluster);
}

// Global UI Functions
window.handleUpvote = function(id) {
  const pinInput = document.getElementById('pin-' + id).value;
  if(!pinInput || pinInput.length < 6) { alert("Please enter a valid 6-digit PIN code."); return; }
  
  const v = JSON.parse(localStorage.getItem('hap_voters') || '{}');
  if(!v[id]) v[id] = [];
  if(v[id].includes(pinInput)) { alert("An upvote from this PIN code is already registered for this issue."); return; }
  
  v[id].push(pinInput);
  localStorage.setItem('hap_voters', JSON.stringify(v));
  
  const upvotes = JSON.parse(localStorage.getItem('hap_upvotes') || '{}');
  const item = FEED_ITEMS.find(i => i.id === id);
  if(!upvotes[id]) upvotes[id] = item.upvotes;
  upvotes[id]++;
  localStorage.setItem('hap_upvotes', JSON.stringify(upvotes));
  
  document.getElementById('upvote-count-'+id).innerHTML = upvotes[id] + " Neighbors face this";
  
  // Refresh map to update clusters if it crosses 50
  if(upvotes[id] === 50) {
    if(mapMode === 'grievances') renderGrievances();
  }
};

window.generateRTI = function(id) {
  const item = FEED_ITEMS.find(i => i.id === id);
  const win = window.open("", "_blank");
  win.document.write(`
    <html><head><title>RTI Draft</title><style>body{font-family:serif; padding:40px; line-height:1.6; max-width:800px; margin:auto;}</style></head><body>
    <h2>Right to Information Act, 2005</h2>
    <p><b>To:</b> Public Information Officer, ${item.dept || 'Relevant Department'}, District ${item.district}, Himachal Pradesh</p>
    <p><b>Subject:</b> Request for information regarding unresolved civic issue at ${item.district}.</p>
    <p>Dear Sir/Madam,</p>
    <p>Under the Right to Information Act, 2005, please provide the following details regarding the issue described below:</p>
    <blockquote style="background:#f4f4f4; padding:10px; border-left:3px solid #333;">${item.text}</blockquote>
    <p>1. Please provide a certified copy of the work order / tender allotted to contractor: <b>${item.contractor || 'Unknown'}</b>.<br>
    2. Please provide the status of the repair work and the estimated completion date.<br>
    3. Provide copies of any show-cause notices issued for the delay.</p>
    <p><b>Date:</b> ${new Date().toLocaleDateString()}</p>
    <p><b>Applicant Signature:</b> ___________________</p>
    <button onclick="window.print()" style="margin-top:40px; padding:10px; cursor:pointer;">Print RTI Application</button>
    </body></html>
  `);
};
'''
    if "function renderGrievances" not in content:
        content = content.replace('// ---- FEED ----', render_fn + '\n// ---- FEED ----')

    # Hazard layer logic
    hazard_logic = '''
document.getElementById('layer-weather').addEventListener('change', function(e) {
  if(e.target.checked) {
    hazardLayer = L.layerGroup();
    // Demo hazard points
    L.circleMarker([32.45, 76.53], {radius:12, fillColor:'#facc15', color:'#ca8a04', weight:2, fillOpacity:0.6}).bindPopup("<b>Landslide Warning</b><br>NH-154A active block.").addTo(hazardLayer);
    L.circleMarker([31.90, 77.10], {radius:12, fillColor:'#facc15', color:'#ca8a04', weight:2, fillOpacity:0.6}).bindPopup("<b>Flash Flood Risk</b><br>Water levels rising near Mandi bridge.").addTo(hazardLayer);
    map.addLayer(hazardLayer);
  } else {
    if(hazardLayer) map.removeLayer(hazardLayer);
  }
});
'''
    if "layer-weather" in content and "hazardLayer = L.layerGroup" not in content:
        content = content.replace('document.getElementById("pills").addEventListener("click"', hazard_logic + '\ndocument.getElementById("pills").addEventListener("click"')


    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")

update_file('dashboard.html')
update_file('himachal_dashboard_v2.html')
