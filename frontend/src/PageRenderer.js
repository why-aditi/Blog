import React from "react";
import { useParams } from "react-router-dom";

const generatePage = (page) => {
  try {
    const Component = require(`./pages/${page}`).default;
    return <Component />;
  } catch (err) {
    console.warn("Page not found:", err);
    return <div>404 - Page Not Found</div>;
  }
};

export default function PageRenderer() {
  const { page } = useParams();
  return generatePage(page);
}
