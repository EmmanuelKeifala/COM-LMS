import Link from 'next/link';
import React from 'react';

type Props = {};

const Navbar = (props: Props) => {
  return (
    <header className="shadow">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between p-3 font-medium">
        <Link href="">New Meeting</Link>

        <div className="flex items-center gap-5">
          <Link href="/meeting">Meetings</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
