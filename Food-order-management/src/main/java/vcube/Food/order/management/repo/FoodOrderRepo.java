package vcube.Food.order.management.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vcube.Food.order.management.model.Foodordermanagement;

@Repository
public interface FoodOrderRepo extends JpaRepository<Foodordermanagement, Integer> {

	List<Foodordermanagement> findByCustomerEmail(String customerEmail);

	List<Foodordermanagement> findByOrderStatus(String orderStatus);

	List<Foodordermanagement> findByCustomerPhone(Long customerPhone);
}
