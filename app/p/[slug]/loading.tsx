import React from 'react';

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex justify-center pb-24 md:py-12 animate-pulse">
      <div className="w-full max-w-[672px] mx-auto md:px-6">
        <div className="card w-full flex flex-col p-0 md:p-8 md:rounded-[24px] border-none md:border-solid md:border-[var(--color-border)] overflow-hidden bg-[var(--color-bg)]">
          {/* Image Placeholder */}
          <div className="w-full aspect-square bg-[var(--color-border)] opacity-20"></div>

          {/* Content Placeholder */}
          <div className="p-5 md:p-0 md:mt-8 flex flex-col space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-32 bg-[var(--color-border)] opacity-30 rounded-md"></div>
              <div className="h-8 w-64 bg-[var(--color-border)] opacity-40 rounded-md"></div>
            </div>

            <div className="h-10 w-40 bg-[var(--color-border)] opacity-50 rounded-md mt-4"></div>

            <div className="space-y-3 pt-6 border-t border-[var(--color-border)]">
              <div className="h-4 w-full bg-[var(--color-border)] opacity-30 rounded-md"></div>
              <div className="h-4 w-5/6 bg-[var(--color-border)] opacity-30 rounded-md"></div>
              <div className="h-4 w-4/6 bg-[var(--color-border)] opacity-30 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Button Placeholder for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--color-bg)] border-t border-[var(--color-border)] md:hidden">
        <div className="h-14 w-full bg-[var(--color-border)] opacity-40 rounded-xl"></div>
      </div>
    </div>
  );
}
