import { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeInUp } from "../../animation";

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="rounded-md mb-3 bg-white"
    >
      <button
        className="w-full flex justify-between items-center p-4 text-left font-medium text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question} {isOpen ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-[#D1D5DB] text-gray-700">
          {answer}
        </div>
      )}
    </motion.div>
  );
};

export default AccordionItem