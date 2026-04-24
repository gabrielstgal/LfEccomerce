import api from './api';

/**
 * Cria um checkout no AbacatePay via backend e retorna a URL de pagamento.
 *
 * @param {Array}  cartItems  - Itens do carrinho (id, quantity, selectedSize)
 * @param {Object} address    - Endereço de entrega
 * @param {string} customerCpf   - CPF do cliente (somente números)
 * @param {string} customerPhone - Telefone do cliente (somente números)
 * @returns {Promise<{paymentUrl: string, orderId: number}>}
 */
export async function createPayment(cartItems, address, customerCpf, customerPhone) {
  const payload = {
    items: cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      size: item.selectedSize || null,
    })),
    ...address,
    customerCpf,
    customerPhone,
  };

  const response = await api.post('/payment/create-checkout', payload);
  return response.data; // { paymentUrl, orderId }
}
