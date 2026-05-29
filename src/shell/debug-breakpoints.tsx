export function Breakpoints() {
   return (
      <div className="fixed right-4 bottom-10 z-999 flex flex-col gap-2 p-4">
         <p className="md:hidden lg:hidden xl:hidden">sm</p>
         <p className="hidden md:block lg:hidden xl:hidden">md</p>
         <p className="hidden lg:block xl:hidden">lg</p>
         <p className="hidden xl:block">xl</p>
      </div>
   );
}
