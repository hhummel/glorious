import { Order } from '../../types';
import { parcelCost } from '../config';

/**
 * Calculates shipping cost from a ShoppingCart
 * @param cart: Array<Order>
 * @returns shippingTotal: Number
 * 
 * Note: Crude estimate with fixed cost for each shipped Order
 */

export default function shippingCost(cart: Array<Order>) {
    const shippingTotal = cart.filter(order => order.ship_this === true).length * parcelCost;
    return shippingTotal;
}
