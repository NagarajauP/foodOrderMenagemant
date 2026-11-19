package vcube.Food.order.management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vcube.Food.order.management.model.Foodordermanagement;
import vcube.Food.order.management.service.FoodOrderService;

@RestController
@RequestMapping("/foodorder")
@CrossOrigin(origins = "*")
public class FoodOrderController {

	@Autowired
	private FoodOrderService foodOrderService;

	@GetMapping("/wel")
	public String welcome() {
		return "Welcome to Food Order Management System";
	}

	@PostMapping("/create")
	public Foodordermanagement createOrder(@RequestBody Foodordermanagement order) {
		return foodOrderService.createOrder(order);
	}

	@GetMapping("/getorders")
	public List<Foodordermanagement> getAllOrders() {
		return foodOrderService.getAllOrders();
	}

	@GetMapping("/getOrder/{orderId}")
	public Foodordermanagement getOrderById(@PathVariable Integer orderId) {
		return foodOrderService.getOrderById(orderId);
	}

	@PutMapping("/update/{orderId}")
	public Foodordermanagement updateOrder(@RequestBody Foodordermanagement order, @PathVariable Integer orderId) {
		return foodOrderService.updateOrder(order, orderId);
	}

	@DeleteMapping("/delete/{orderId}")
	public String deleteOrder(@PathVariable Integer orderId) {
		foodOrderService.deleteOrder(orderId);
		return "Order " + orderId + " Deleted Successfully";
	}

	@GetMapping("/getorders/email/{email}")
	public List<Foodordermanagement> getOrdersByEmail(@PathVariable String email) {
		return foodOrderService.getOrdersByEmail(email);
	}

	@GetMapping("/getorders/status/{status}")
	public List<Foodordermanagement> getOrdersByStatus(@PathVariable String status) {
		return foodOrderService.getOrdersByStatus(status);
	}
}
