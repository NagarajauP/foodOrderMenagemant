package vcube.Food.order.management.service;

import java.util.List;

import vcube.Food.order.management.model.Foodordermanagement;

public interface FoodOrderService {

	public abstract Foodordermanagement createOrder(Foodordermanagement order);

	public abstract List<Foodordermanagement> getAllOrders();

	public abstract Foodordermanagement getOrderById(Integer orderId);

	public abstract Foodordermanagement updateOrder(Foodordermanagement order, Integer orderId);

	public abstract void deleteOrder(Integer orderId);

	public abstract List<Foodordermanagement> getOrdersByEmail(String email);

	public abstract List<Foodordermanagement> getOrdersByStatus(String status);
}
