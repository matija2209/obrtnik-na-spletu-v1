"use client"
import { cn } from "@/lib/utils";
import { getIconComponent } from "@/utilities/getIcon";

interface ServiceIconProps {
    icon?: string | null;
    className?: string;
  }

const SvgIcon: React.FC<ServiceIconProps> = ({ icon,className }) => {
    if(!icon) return null
    const IconSvg = getIconComponent(icon)
    
    return (
      <div className={cn("flex absolute -top-10 left-8 shrink-0 gap-2.5 items-center justify-center p-4 w-20 h-20 bg-accent rounded-full",className)}>
        <IconSvg></IconSvg>
      </div>
    );
  };

  export default SvgIcon