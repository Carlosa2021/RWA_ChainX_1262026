// Test script para verificar el tema
// Pega esto en la consola del navegador (F12)

console.log("=== DIAGNÓSTICO DEL TEMA ===");
console.log("1. Clase 'dark' en <html>:", document.documentElement.classList.contains('dark'));
console.log("2. localStorage theme:", localStorage.getItem('theme'));
console.log("3. Computed background:", getComputedStyle(document.body).backgroundColor);

// Probar toggle manualmente
console.log("\n=== PRUEBA MANUAL ===");
console.log("Ejecuta estos comandos uno por uno:");
console.log("document.documentElement.classList.add('dark')");
console.log("document.documentElement.classList.remove('dark')");
console.log("\nSi al ejecutar estos comandos el fondo NO cambia, el problema es el CSS.");
console.log("Si SÍ cambia, el problema es el ThemeContext.");
