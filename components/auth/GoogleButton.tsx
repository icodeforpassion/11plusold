'use client';

import { Button } from '../Button';

interface GoogleButtonProps {
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  label?: string;
}

export function GoogleButton({ onClick, disabled, label = 'Continue with Google' }: GoogleButtonProps) {
  return (
    <Button type="button" variant="secondary" onClick={onClick} disabled={disabled} className="w-full gap-3">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
        <svg viewBox="0 0 533.5 544.3" aria-hidden="true" className="h-3.5 w-3.5">
          <path
            d="M533.5 278.4c0-17.4-1.5-34.2-4.4-50.5H272v95.7h146.9c-6.3 34-25 62.8-53.5 82v68h86.5c50.6-46.6 81.6-115.4 81.6-195.2z"
            fill="#4285F4"
          />
          <path
            d="M272 544.3c72.6 0 133.5-24.1 178-65.7l-86.5-68c-24.1 16.2-55 25.8-91.5 25.8-70.4 0-130-47.5-151.3-111.2h-90.6v69.9C74.5 484 166.5 544.3 272 544.3z"
            fill="#34A853"
          />
          <path
            d="M120.7 325.2c-10.2-30-10.2-62.4 0-92.4v-69.9H30.1c-39.2 78-39.2 169.2 0 247.2l90.6-69.9z"
            fill="#FBBC04"
          />
          <path
            d="M272 107.7c39.5-.6 77.6 14.8 106.5 42.9l79.2-79.2C413.7 24.3 344.4-1.4 272 0 166.5 0 74.5 60.3 30.1 153.3l90.6 69.9C142 155.2 201.6 107.7 272 107.7z"
            fill="#EA4335"
          />
        </svg>
      </span>
      <span>{label}</span>
    </Button>
  );
}
