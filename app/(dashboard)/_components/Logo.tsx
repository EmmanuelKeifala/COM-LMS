import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link href={'/'}>
      <Image height={200} width={200} alt="logo" src="/logo1.png" />;
    </Link>
  );
};
