export const orderConfirmationTemplate = (order, userName) => {
  const deliveryTypeText = {
    'delivery': 'Livraison à domicile',
    'pickup': 'Retrait en magasin',
    'in_store': 'Consommation sur place'
  };

  const paymentMethodText = {
    'cash_on_delivery': 'Paiement à la livraison',
    'bank_transfer': 'Virement bancaire'
  };

  const itemsHtml = order.items.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px; border-right: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; text-align: center; border-right: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 12px; text-align: right; border-right: 1px solid #eee;">${item.price.toFixed(3)} TND</td>
      <td style="padding: 12px; text-align: right;">${item.subtotal.toFixed(3)} TND</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de commande</title>
    </head>
    <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Confirmation de commande</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Merci pour votre confiance !</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
          
          <!-- Greeting -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #667eea; margin: 0 0 10px; font-size: 22px;">Bonjour ${userName},</h2>
            <p style="margin: 0; font-size: 16px; color: #666;">
              Votre commande a été confirmée avec succès. Voici les détails :
            </p>
          </div>

          <!-- Order Info -->
          <div style="background-color: #f8f9ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <strong style="color: #667eea;">Numéro de commande :</strong><br>
                <span style="font-size: 18px; font-weight: bold; color: #333;">${order.orderNumber}</span>
              </div>
              <div>
                <strong style="color: #667eea;">Date :</strong><br>
                <span>${new Date(order.orderDate).toLocaleDateString('fr-FR')}</span>
              </div>
              <div>
                <strong style="color: #667eea;">Type de service :</strong><br>
                <span>${deliveryTypeText[order.deliveryType]}</span>
              </div>
              <div>
                <strong style="color: #667eea;">Téléphone :</strong><br>
                <span>${order.phone}</span>
              </div>
            </div>
          </div>

          <!-- Shipping Address (si delivery) -->
          ${order.deliveryType === 'delivery' && order.shippingAddress ? `
            <div style="background-color: #fff8f0; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #ff9500;">
              <h3 style="margin: 0 0 15px; color: #ff9500; font-size: 18px;">📍 Adresse de livraison</h3>
              <p style="margin: 0; line-height: 1.8;">
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city} ${order.shippingAddress.postalCode}
              </p>
              ${order.paymentMethod ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ffcc80;">
                  <strong style="color: #ff9500;">Mode de paiement :</strong> ${paymentMethodText[order.paymentMethod]}
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Items Table -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #667eea; margin: 0 0 15px; font-size: 20px;">📦 Articles commandés</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background: linear-gradient(135deg, #667eea, #764ba2); color: white;">
                  <th style="padding: 15px; text-align: left; font-weight: bold;">Article</th>
                  <th style="padding: 15px; text-align: center; font-weight: bold;">Qté</th>
                  <th style="padding: 15px; text-align: right; font-weight: bold;">Prix unit.</th>
                  <th style="padding: 15px; text-align: right; font-weight: bold;">Sous-total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <!-- Total Section -->
          <div style="background: linear-gradient(135deg, #f8f9ff, #e3f2fd); border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 2px solid #667eea;">
            <div style="text-align: right;">
              ${order.shippingCost > 0 ? `
                <div style="margin-bottom: 8px; font-size: 16px;">
                  <span>Frais de livraison : </span>
                  <span style="font-weight: bold;">${order.shippingCost.toFixed(3)} TND</span>
                </div>
              ` : ''}
              <div style="font-size: 22px; font-weight: bold; color: #667eea; margin-top: 15px; padding-top: 15px; border-top: 2px solid #667eea;">
                <span>Total : ${order.totalAmount.toFixed(3)} TND</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          ${order.notes ? `
            <div style="background-color: #f0f8ff; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #4a90e2;">
              <h4 style="margin: 0 0 10px; color: #4a90e2;">💬 Notes :</h4>
              <p style="margin: 0; font-style: italic; color: #666;">${order.notes}</p>
            </div>
          ` : ''}

          <!-- Next Steps -->
          <div style="background-color: #f0fff4; border-radius: 8px; padding: 20px; border-left: 4px solid #28a745;">
            <h4 style="margin: 0 0 15px; color: #28a745;">✅ Prochaines étapes :</h4>
            <ul style="margin: 0; padding-left: 20px; color: #666;">
              <li style="margin-bottom: 8px;">Votre commande sera traitée dans les plus brefs délais</li>
              <li style="margin-bottom: 8px;">Vous recevrez un email de confirmation d'expédition</li>
              <li style="margin-bottom: 8px;">N'hésitez pas à nous contacter pour toute question</li>
            </ul>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #2c3e50; color: white; padding: 25px; text-align: center;">
          <p style="margin: 0 0 10px; font-size: 16px;">Merci de votre confiance !</p>
          <p style="margin: 0; font-size: 14px; opacity: 0.8;">
            Pour toute question, contactez-nous à : support@yourapp.com
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;
};

export const orderConfirmationTextTemplate = (order, userName) => {
  const deliveryTypeText = {
    'delivery': 'Livraison à domicile',
    'pickup': 'Retrait en magasin', 
    'in_store': 'Consommation sur place'
  };

  const paymentMethodText = {
    'cash_on_delivery': 'Paiement à la livraison',
    'bank_transfer': 'Virement bancaire'
  };

  let itemsList = order.items.map(item => 
    `- ${item.name} (x${item.quantity}) : ${item.subtotal.toFixed(3)} TND`
  ).join('\n');

  let addressText = '';
  if (order.deliveryType === 'delivery' && order.shippingAddress) {
    addressText = `
Adresse de livraison :
${order.shippingAddress.street}
${order.shippingAddress.city} ${order.shippingAddress.postalCode}
${order.paymentMethod ? `Mode de paiement : ${paymentMethodText[order.paymentMethod]}` : ''}
`;
  }

  return `
Confirmation de commande

Bonjour ${userName},

Votre commande a été confirmée avec succès !

DÉTAILS DE LA COMMANDE :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Numéro de commande : ${order.orderNumber}
Date : ${new Date(order.orderDate).toLocaleDateString('fr-FR')}
Type de service : ${deliveryTypeText[order.deliveryType]}
Téléphone : ${order.phone}
${addressText}
ARTICLES COMMANDÉS :
${itemsList}
${order.shippingCost > 0 ? `\nFrais de livraison : ${order.shippingCost.toFixed(3)} TND` : ''}

TOTAL : ${order.totalAmount.toFixed(3)} TND

${order.notes ? `Notes : ${order.notes}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROCHAINES ÉTAPES :
• Votre commande sera traitée dans les plus brefs délais
• Vous recevrez un email de confirmation d'expédition
• N'hésitez pas à nous contacter pour toute question

Merci de votre confiance !

Support : contact@hajicosmetiques.com
  `;
};