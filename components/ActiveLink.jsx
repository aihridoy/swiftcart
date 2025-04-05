"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ActiveLink = ({ href, children, className = "" }) => {
  const pathname = usePathname();
  
  const isActive = 
    href === '/' 
      ? pathname === '/' 
      : pathname === href || pathname.startsWith(`${href}/`);
  
  const activeClass = isActive 
    ? "text-white font-medium border-b-2 border-white" 
    : "text-gray-200 hover:text-white";
  
  return (
    <Link href={href} className={`${activeClass} ${className} transition`}>
      {children}
    </Link>
  );
};

export default ActiveLink;