echo "Configurando repositorios remotos..."

echo "Configurando STARTER..."
cd "C:\Users\User\Desktop\chainx-rwa-starter"
git remote add origin https://github.com/Carlosa2021/chainx-rwa-starter.git
git push -u origin main

echo "Configurando PRO..."
cd "C:\Users\User\Desktop\chainx-rwa-pro"
git remote add origin https://github.com/Carlosa2021/chainx-rwa-pro.git
git push -u origin main

echo "Configurando ENTERPRISE..."
cd "C:\Users\User\Desktop\chainx-rwa-enterprise"
git remote add origin https://github.com/Carlosa2021/chainx-rwa-enterprise.git
git push -u origin main

cd "C:\Users\User\Desktop\RWA-InmoToken"
echo "Configuracion completada!"