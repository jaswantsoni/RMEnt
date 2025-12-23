import React, { useEffect, useState } from 'react'
import { Categories } from '@/lib/categories'
import { cn } from '@/lib/utils'

const NavBar = () => {
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [categories, setCategories] = useState(Categories)
    const [subCategories, setSubCategories] = useState(Categories[0].subcategories)
    const [category1, setCategory1] = useState('');
    const [category2, setCategory2] = useState('');


    const toggle = (view: string) => {
        switch (view) {
            case 'show1':
                setShow1(!show1);
                break;
            case 'show2':
                setShow2(!show2);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        // console.log("show1",show1)
        // console.log("show2", show2)
        // console.log("show3", show3)
    }, [show1, show2])
    return (
        <div>
            <div className="flex space-x-5 justify-around my-5 border-y py-4 border-gold-light">
                {categories.map((category, index) => (
                    <button key={index} tabIndex={0} onMouseEnter={() => { setShow1(true); setSubCategories(category.subcategories) }} className={cn(
                        'text-lg font-medium tracking-wide transition-colors duration-300',
                        location.pathname === '/contact'
                            ? 'text-primary'
                            : 'text-foreground/70 hover:text-primary'
                    )}>{category.category}</button>

                ))}
            </div>
            <div className={cn('flex space-x-5 justify-around mb-5 border-b py-4 border-gold-light', show1 ? '' : 'hidden')}>
                {subCategories.map((subcategory, index) => (
                    <button key={index} tabIndex={0} onMouseLeave={()=>{}} className={cn(
                        'text-lg font-medium tracking-wide transition-colors duration-300',
                        location.pathname === '/contact'
                            ? 'text-primary'
                            : 'text-foreground/70 hover:text-primary'
                    )}>{subcategory.name}</button>

                ))}
            </div>


        </div>
    )
}

export default NavBar