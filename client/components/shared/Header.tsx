import React from "react";
import { ProfileButton } from "./ProfileButton";

export const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-neutral-200 shadow-md">
      <div></div>
      <div>
        <ProfileButton />
      </div>
    </header>
  );
};
