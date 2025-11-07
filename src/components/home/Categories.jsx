import React from "react";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import { FaArrowRight } from "react-icons/fa";

const Categories = ({ categories }) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16">
          <div>
            <h2 className="text-4xl font-bold text-dark-text mb-4">
              Popular Sports Categories
            </h2>
            <p className="text-xl text-medium-text">
              Discover and book your favorite sports
            </p>
          </div>
          <Link
            to="/explore"
            className="mt-4 sm:mt-0 text-primary-green font-semibold flex items-center gap-2 hover:gap-3 transition-all duration-300"
          >
            View All Sports
            <FaArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category.sport_id}
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
