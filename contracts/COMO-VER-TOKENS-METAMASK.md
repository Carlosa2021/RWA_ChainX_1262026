# 🦊 Cómo Ver tus Tokens INMO-TEST-001 en MetaMask

## 📝 Pasos Simples:

### 1. Abre MetaMask
- Asegúrate de estar en **Polygon Mainnet**
- Selecciona tu wallet: `0xA62F...21ca`

### 2. Importa el Token
- Scroll hacia abajo en la lista de tokens
- Click en **"Import tokens"** (al final)
- Click en **"Custom token"**

### 3. Pega la Dirección del Contrato
```
0xA15b7BFdc26eEE1e4687D45cd2C9d6049956fd45
```

### 4. Auto-Completa
MetaMask automáticamente detectará:
- **Token Symbol**: `INMO-TEST-001`
- **Token Decimals**: `0` (tokens indivisibles)

### 5. Click "Add Custom Token"
- Luego "Import"

### ✅ ¡Listo!
Ahora verás:
```
INMO-TEST-001
3 tokens
```

---

## 🔗 Links Útiles:

**🔍 Ver en PolygonScan:**
https://polygonscan.com/token/0xA15b7BFdc26eEE1e4687D45cd2C9d6049956fd45?a=0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca

**📊 Ver Transacciones:**
1. Primera inversión: https://polygonscan.com/tx/0xe8bc062fee3ccbf6dc2aa023f828c3bc97f3d4b95df831ff8eeb59f53a89dfd5
2. Segunda inversión: https://polygonscan.com/tx/0x4b252fc187ee11a83ae338661e4d761e600d9907919c45b1acadaccc2fd64d0f
3. Tercera inversión: https://polygonscan.com/tx/0x5017e18c0bbe44eb8374616393fc65c73ce266049c8c61730a358618f0153934

---

## 💡 Nota sobre el Treasury:

**¿Dónde van los USDC que pagas?**
- Van al **Treasury** configurado en el InvestmentController
- En este caso, el treasury ES TU PROPIA WALLET: `0xA62F...21ca`
- Por eso tu balance USDC no cambia mucho (eres inversor Y treasury)
- En producción, el treasury sería la cuenta del emisor del proyecto

**¿Cómo aparecen los tokens?**
- El InvestmentController llama a `SecurityToken.issue(buyer, amount)`
- Los tokens se **crean automáticamente** (mint) en tu wallet
- No necesitas hacer nada, están ahí instantáneamente
- Solo necesitas importar el contrato en MetaMask para **verlos visualmente**

---

## 📈 Estado Actual:

```
Campaign: Test Campaign - Apartamento Testing
Symbol:   INMO-TEST-001
Contract: 0xA15b7BFdc26eEE1e4687D45cd2C9d6049956fd45

Progreso:  3/5 tokens (60%)
Tus tokens: 3
Precio:    €1 por token
Valor:     €3.00 (~$3.49)
```

## 🎯 Para el Demo del Congreso:

✅ Ya tienes 3 inversiones completadas
✅ Puedes hacer 1-2 inversiones más de prueba
✅ O dejar tokens disponibles para invertir EN VIVO durante el demo
✅ Todas las transacciones son verificables en PolygonScan

**Recomendación:** Deja al menos 1 token sin vender para poder hacer una inversión EN VIVO durante la presentación del congreso. Será mucho más impactante mostrar el proceso en tiempo real.
