import { NextPage } from 'next'

interface Props {
    color: string,
}

const AngularBrackets: NextPage<Props> = ({color}) => {
  return (
    <div className='flex gap-2'>
        <div className=''>
            <svg xmlns="http://www.w3.org/2000/svg" width="184" height="118" viewBox="0 0 184 118" fill="none">
                <path d="M90.8789 117.342L165.362 72.0543C182.894 61.4006 188.877 37.7787 178.766 19.3042C168.656 0.82979 146.239 -5.4747 128.707 5.17903L0 83.4661L90.8789 117.342Z" fill={color}/>
            </svg>
            <svg className='relative bottom-10 right-[18px]' xmlns="http://www.w3.org/2000/svg" width="202" height="156" viewBox="0 0 202 156" fill="none">
                <path d="M165.316 155.528C177.964 155.528 190.308 148.625 197.086 136.215C207.196 117.741 201.213 94.1195 183.681 83.4658L54.974 5.17902C37.4419 -5.47468 15.0252 0.829788 4.91489 19.3042C-5.19541 37.7786 0.787378 61.4004 18.3195 72.054L147.027 150.341C152.783 153.852 159.106 155.528 165.316 155.528Z" fill={color}/>
            </svg>
        </div>
        <div className='rotate-y-180'>
            <svg xmlns="http://www.w3.org/2000/svg" width="184" height="118" viewBox="0 0 184 118" fill="none">
                <path d="M90.8789 117.342L165.362 72.0543C182.894 61.4006 188.877 37.7787 178.766 19.3042C168.656 0.82979 146.239 -5.4747 128.707 5.17903L0 83.4661L90.8789 117.342Z" fill={color}/>
            </svg>
            <svg className='relative bottom-10 right-[18px]' xmlns="http://www.w3.org/2000/svg" width="202" height="156" viewBox="0 0 202 156" fill="none">
                <path d="M165.316 155.528C177.964 155.528 190.308 148.625 197.086 136.215C207.196 117.741 201.213 94.1195 183.681 83.4658L54.974 5.17902C37.4419 -5.47468 15.0252 0.829788 4.91489 19.3042C-5.19541 37.7786 0.787378 61.4004 18.3195 72.054L147.027 150.341C152.783 153.852 159.106 155.528 165.316 155.528Z" fill={color}/>
            </svg>
        </div>
    </div>
)
}

export default AngularBrackets