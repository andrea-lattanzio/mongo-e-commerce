<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <a href="https://www.mongodb.com" target="blank"><img src="https://icon.icepanel.io/Technology/svg/MongoDB.svg" width="120" alt="Nest Logo" /></a>
</p>

# NestJS + MongoDB Practice

This repository is a practice project built with **NestJS** and **MongoDB (Mongoose)**.  
It demonstrates how to work with schemas, perform CRUD operations, run aggregations, and use MongoDB transactions.  

---

## 📌 Features

- **Schema Declaration**:  
  - Defines three separate collections with Mongoose schemas including:
    - Instance methods  
    - Static methods  
    - Indexes  
    - Pre-save hooks  
- **CRUD Operations**:  
  - Create, Read, Update, and Delete using native Mongoose methods with document population.  
- **Aggregations**:  
  - Practice with pipelines (`$match`, `$group`, `$lookup`, `$unwind`, `$project`).  
- **Transactions**:  
  - Uses transactions to handle operations across multiple collections.  

---

## 🗂 Collections

This project includes three collections for practice:

1. **Users** – basic user information  
2. **Products** – items with price, stock, etc.  
3. **Orders** – references users and products  

---

## ⚙️ Tech Stack

- [NestJS](https://nestjs.com/) – backend framework  
- [MongoDB](https://www.mongodb.com/) – NoSQL database  
- [Mongoose](https://mongoosejs.com/) – ODM for schema and DB operations  

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/andrea-lattanzio/mongo-e-commerce.git
cd mongo-e-commerce.git
```
### 2. Install dependencies
```bash
npm install
```
### 3. Configure .env file
```bash
MONGODB_URI=mongodb://localhost:27017/e-commerce
```
### 4. Run application
```bash
npm run start:dev
```
