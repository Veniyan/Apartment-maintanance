package com.example.apartment.controller;

import com.example.apartment.model.Expense;
import com.example.apartment.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        if (expense.getDate() == null) {
            expense.setDate(LocalDate.now());
        }
        return ResponseEntity.ok(expenseRepository.save(expense));
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return ResponseEntity.ok(expenseRepository.findAll());
    }

    @GetMapping("/month/{year}/{month}")
    public ResponseEntity<List<Expense>> getExpensesByMonth(@PathVariable int year, @PathVariable int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        return ResponseEntity.ok(expenseRepository.findByDateBetween(startDate, endDate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().body("ID is required");
        }
        if (!expenseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        expenseRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
