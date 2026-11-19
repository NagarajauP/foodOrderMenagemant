package vcube.Food.order.management.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vcube.Food.order.management.model.Foodordermanagement;
import vcube.Food.order.management.repo.FoodOrderRepo;

@Service
public class FoodOrderServiceImpl implements FoodOrderService {

	@Autowired
	private FoodOrderRepo foodOrderRepo;

	@Override
	public Foodordermanagement createOrder(Foodordermanagement order) {
		// Calculate total amount automatically if quantity and price are provided
		if (order.getPrice() != null && order.getQuantity() != null) {
			order.setTotalAmount(order.getPrice() * order.getQuantity());
		}
		if (order.getOrderStatus() == null || order.getOrderStatus().trim().isEmpty()) {
			order.setOrderStatus("PENDING");
		}
		return foodOrderRepo.save(order);
	}

	@Override
	public List<Foodordermanagement> getAllOrders() {
		return foodOrderRepo.findAll();
	}

	@Override
	public Foodordermanagement getOrderById(Integer orderId) {
		return foodOrderRepo.findById(orderId).orElse(null);
	}

	@Override
	public Foodordermanagement updateOrder(Foodordermanagement order, Integer orderId) {
		Foodordermanagement existingOrder = foodOrderRepo.findById(orderId).orElse(null);
		if (existingOrder != null) {
			existingOrder.setCustomerName(order.getCustomerName());
			existingOrder.setCustomerEmail(order.getCustomerEmail());
			existingOrder.setCustomerPhone(order.getCustomerPhone());
			existingOrder.setFoodItem(order.getFoodItem());
			existingOrder.setCategory(order.getCategory());
			existingOrder.setQuantity(order.getQuantity());
			existingOrder.setPrice(order.getPrice());

			if (order.getPrice() != null && order.getQuantity() != null) {
				existingOrder.setTotalAmount(order.getPrice() * order.getQuantity());
			} else {
				existingOrder.setTotalAmount(order.getTotalAmount());
			}

			if (order.getOrderStatus() != null && !order.getOrderStatus().trim().isEmpty()) {
				existingOrder.setOrderStatus(order.getOrderStatus());
			}
			existingOrder.setDeliveryAddress(order.getDeliveryAddress());
			existingOrder.setPaymentMode(order.getPaymentMode());

			return foodOrderRepo.save(existingOrder);
		}
		return null;
	}

	@Override
	public void deleteOrder(Integer orderId) {
		foodOrderRepo.deleteById(orderId);
	}

	@Override
	public List<Foodordermanagement> getOrdersByEmail(String email) {
		return foodOrderRepo.findByCustomerEmail(email);
	}

	@Override
	public List<Foodordermanagement> getOrdersByStatus(String status) {
		return foodOrderRepo.findByOrderStatus(status);
	}
}
