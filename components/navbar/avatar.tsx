import { Avatar, AvatarImage } from "@/components/ui/avatar";
import avatarImg from "@/assets/image-avatar.png";

export default function AvatarCom() {
  return (
   
      <Avatar className="h-10 w-10 border-2 border-transparent hover:border-black transition-all cursor-pointer mx-2">
        <AvatarImage src={avatarImg.src} alt="@user" />
      </Avatar>

  );
}
