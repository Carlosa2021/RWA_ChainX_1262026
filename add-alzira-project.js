// Script para agregar manualmente el proyecto de Alzira
// Este código debe ejecutarse en la consola del navegador en localhost:3000

const alzirapProject = {
  id: 1,
  name: "Inmueble Reyes Católicos Alzira",
  symbol: "RCA97-001",
  description: "Apartamento de lujo en pleno centro de Alzira. 6 habitaciones, salón, cocina, 2 baños independientes, patio cubierto central y solarium/terraza. Ubicado en las prestigiosas calles del centro histórico.",
  location: "Calle Reyes Católicos 97, 1º y 1ªA, Alzira, Valencia C.P. 46600, España",
  totalValue: "175000",
  pricePerToken: "1000",
  maxTokens: "175",
  expectedReturn: "8",
  duration: "3",
  propertyType: "Residencial - Apartamento",
  metadataURI: "ipfs://QmMockHash" + Date.now(),
  tokenAddress: "0x" + Math.random().toString(16).substr(2, 40),
  controllerAddress: "0x" + Math.random().toString(16).substr(2, 40),
  distributorAddress: "0x" + Math.random().toString(16).substr(2, 40),
  transactionHash: "0x" + Math.random().toString(16).substr(2, 64),
  createdAt: new Date().toISOString(),
  status: "active"
};

// Obtener proyectos existentes
const existingProjects = JSON.parse(localStorage.getItem('rwa-projects') || '[]');

// Agregar el proyecto si no existe
const projectExists = existingProjects.some(p => p.name === alzirapProject.name);
if (!projectExists) {
  existingProjects.push(alzirapProject);
  localStorage.setItem('rwa-projects', JSON.stringify(existingProjects));
  console.log('✅ Proyecto de Alzira agregado exitosamente!');
  console.log('📊 Total de proyectos:', existingProjects.length);
  
  // Recargar la página para ver los cambios
  window.location.reload();
} else {
  console.log('⚠️ El proyecto ya existe');
}