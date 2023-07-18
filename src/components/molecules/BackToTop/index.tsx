import { ArrowUpOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
export const BackToTop = () => {
    const backTop = () => {
        window.scrollTo({behavior: 'smooth', top: 10})
    }
    const [y, setY] = useState(0);
    const [isShow, setShow] = useState(false)
    const handleNavigation = useCallback(
        (    e: { currentTarget: any; }) => {
            const window = e.currentTarget;
            console.log('window.scrollY', window.scrollY)
            if (y > window.scrollY) {
                if(window.scrollY > 600) {
                    setShow(true)
                } else {
                    setShow(false)
                }
                console.log("scrolling up");
            } else if (y < window.scrollY) {
                setShow(false)
            }
            setY(window.scrollY);
        }, [y]
    );

    useEffect(() => {
        setY(window.scrollY);
        window.addEventListener("scroll", handleNavigation);

        return () => {
            window.removeEventListener("scroll", handleNavigation);
        };
    }, [handleNavigation]);
    return(
        <div className={`${isShow ? 'block' : 'hidden'} fixed bottom-20 right-20`}>
            <div className='wrap-ratio-[1/1]'>
                <button className='primaryButton back-top p-5 aspect-[1/1] flex justify-center items-center' onClick={backTop}>
                    <ArrowUpOutlined height={30} width={30} />
                </button>
            </div>
        </div>
    )
}