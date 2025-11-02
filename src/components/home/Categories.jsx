import React from "react";
import CategoryCard from "./CategoryCard";

const Categories = ({ categories }) => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark-text mb-4">
            Popular Sports Categories
          </h2>
          <p className="text-xl text-medium-text">
            Discover and book your favorite sports
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="transform hover:scale-105 transition-transform duration-300"
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
