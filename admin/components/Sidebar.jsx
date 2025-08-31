'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { assets } from '@/assets/assets';
import { Users, MessageCircle } from 'lucide-react';

const SideBar = () => {
    const pathname = usePathname()
    const menuItems = [
        { name: 'Nouveau produit', path: '/', icon: assets.add_icon, isImage: true },
        { name: 'Produits', path: '/product-list', icon: assets.product_list_icon, isImage: true },
        { name: 'Commandes', path: '/orders', icon: assets.order_icon, isImage: true },
        { name: 'Clients', path: '/users', icon: Users, isImage: false },
        { name: 'Avis', path: '/avis', icon: MessageCircle, isImage: false },
    ];

    return (
        <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col'>
            {menuItems.map((item) => {
                const isActive = pathname === item.path;

                return (
                    <Link href={item.path} key={item.name} passHref>
                        <div
                            className={`flex items-center py-3 px-4 gap-3 ${isActive
                                ? "border-r-4 md:border-r-[6px] bg-green-600/10 border-green-500/90"
                                : "hover:bg-gray-100/90 border-white"
                            }`}
                        >
                            {item.isImage ? (
                                <Image
                                    src={item.icon}
                                    alt={`${item.name.toLowerCase()}_icon`}
                                    className="w-7 h-7"
                                />
                            ) : (
                                <item.icon className="w-5 h-5" />
                            )}
                            <p className='md:block hidden text-center'>{item.name}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default SideBar;
