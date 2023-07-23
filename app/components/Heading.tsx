'use client';

import Avatar from "./Avatar";
import Logo from "./navbar/Logo";

interface HeadingProps {
  title: string;
  subtitle: string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ 
  title, 
  subtitle,
  center
}) => {
  return ( 
    <div className={center ? 'text-center' : 'text-start'}>
      <div className="text-2xl font-bold">
        {title}
      </div>
      <div className="font-light text-neutral-500 mt-2 text-sm">
        {subtitle && !isNaN(Date.parse(subtitle))? (new Date(subtitle).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })) : (subtitle)}
      </div>
    </div>
   );
}
 
export default Heading;