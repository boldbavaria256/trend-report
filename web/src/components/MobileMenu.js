'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileMenu({ categories }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        // Prevent scrolling when menu is open
        if (!isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    };

    return (
        <div className="md:hidden">
            <button
                onClick={toggleMenu}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground z-50 relative"
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={toggleMenu}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-background border-l border-border z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-lg font-bold">Menu</span>
                        {/* Close button is handled by the toggle button above which is z-50 */}
                    </div>

                    <nav className="flex flex-col space-y-6">
                        <Link
                            href="/"
                            className="text-lg font-medium hover:text-accent transition-colors"
                            onClick={toggleMenu}
                        >
                            Home
                        </Link>

                        <div className="border-t border-border pt-6">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                                Categories
                            </h3>
                            <div className="flex flex-col space-y-4 pl-4">
                                {categories.map((category) => (
                                    <Link
                                        key={category._id}
                                        href={`/categories/${category.slug}`}
                                        className="text-base text-foreground/80 hover:text-accent transition-colors"
                                        onClick={toggleMenu}
                                    >
                                        {category.title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-border pt-6 mt-auto">
                            <Link
                                href="/about"
                                className="block text-base font-medium hover:text-accent transition-colors mb-4"
                                onClick={toggleMenu}
                            >
                                About Us
                            </Link>
                            <Link
                                href="/contact"
                                className="block text-base font-medium hover:text-accent transition-colors"
                                onClick={toggleMenu}
                            >
                                Contact
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
}
