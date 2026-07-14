import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  name: string;
  imageUrl?: string | null;
  size?: number;
}

/* אווטאר משתמש — אותו סגנון כמו בתפריט המשתמש בנאבבר; Radix מציג את ה-fallback גם כשהתמונה נכשלת */
const UserAvatar = ({ name, imageUrl, size = 40 }: Props) => (
  <Avatar className="shrink-0" style={{ width: size, height: size }}>
    {imageUrl && (
      <AvatarImage
        src={imageUrl}
        alt={name}
        referrerPolicy="no-referrer"
        className="object-cover"
      />
    )}
    <AvatarFallback
      className="bg-primary/10 font-display font-bold text-primary"
      style={{ fontSize: size * 0.45 }}
    >
      {(name.charAt(0) || "?").toUpperCase()}
    </AvatarFallback>
  </Avatar>
);

export default UserAvatar;
