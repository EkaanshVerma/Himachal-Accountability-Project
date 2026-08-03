import os

def remove_grievances(filename):
    if not os.path.exists(filename):
        return
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove button
    btn_str1 = '<button class="viz-btn" data-mode="grievances" style="color:var(--urgent);">Grievances & RTI</button>'
    btn_str2 = '<button class="viz-btn" data-mode="grievances">Grievances & RTI</button>'
    content = content.replace(btn_str1, '')
    content = content.replace(btn_str2, '')

    # 2. Remove from renderDistricts
    dist_str = '''  } else if(mapMode==="grievances") {
    geoLayer=L.geoJSON(HP_GEOJSON,{
      style:{fillColor:"#1e2a1e",fillOpacity:0.5,color:"#3a5a3a",weight:1},
      onEachFeature:onEachDistrict
    }).addTo(map);'''
    content = content.replace(dist_str, '')

    # 3. Remove toggles
    t1 = 'if(mapMode==="grievances") renderGrievances();'
    content = content.replace(t1, '')

    t2 = "if(mapMode === 'grievances') renderGrievances();"
    content = content.replace(t2, '')

    # 4. Remove renderGrievances function
    import re
    # We want to remove from 'function renderGrievances() {' to the end of the function.
    # The function ends before '// Global UI Functions' or similar.
    renderG_pattern = re.compile(r'function renderGrievances\(\)\s*\{.*?\n\}\n(?=// Global UI Functions|// ---- FEED ----|function)', re.DOTALL)
    content = re.sub(renderG_pattern, '', content)
    
    # 5. Remove grievanceCluster from clearLayers
    clear_cluster = "if(typeof grievanceCluster !== 'undefined' && grievanceCluster){map.removeLayer(grievanceCluster);grievanceCluster=null;}"
    content = content.replace(clear_cluster, '')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Removed Grievances mode from {filename}")

remove_grievances('dashboard.html')
remove_grievances('himachal_dashboard_v2.html')
