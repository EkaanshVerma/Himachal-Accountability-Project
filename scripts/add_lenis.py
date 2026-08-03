import glob

lenis_css = '<link rel="stylesheet" href="https://unpkg.com/lenis@1.1.18/dist/lenis.css"/>'
lenis_js = """
<!-- Lenis Premium Inertia Smooth Scroll Library -->
<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>
<script>
  // Initialize Lenis Luxurious Slow Inertia Scroll
  const lenis = new Lenis({
    duration: 1.5,           // Slow, weighted luxury deceleration
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky exponential curve
    smoothWheel: true,
    wheelMultiplier: 0.85,    // Weighted scroll momentum
    touchMultiplier: 1.4,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
</script>
"""

html_files = glob.glob("*.html")
for filepath in html_files:
    if filepath == 'dashboard.html':
        continue # Dashboard already has it

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Inject CSS before </head> if not already there
    if 'lenis.css' not in content and '</head>' in content:
        content = content.replace('</head>', f'  {lenis_css}\n</head>')

    # Inject JS before </body> if not already there
    if 'lenis.min.js' not in content and '</body>' in content:
        content = content.replace('</body>', f'{lenis_js}</body>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Injected Lenis slow scroll to all other HTML files.")
