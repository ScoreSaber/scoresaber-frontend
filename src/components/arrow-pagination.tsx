export type PaginationProperties = {
   page: number | undefined;
   maxPages: number;
   callback: PageClickCallback;
};

export interface PageClickCallback {
   (page: number): void;
}

export default function ArrowPagination(properties: PaginationProperties) {
   let page = isNaN(properties.page || 1) ? 1 : parseInt(properties.page?.toString() || '1');
   let maxPages = isNaN(properties.maxPages) ? 1 : parseInt(properties.maxPages.toString());
   return (
      <nav className="pagination">
         {page <= 1 && <br />}
         {page > 1 && (
            <button onClick={() => properties.callback(page - 1)} className="button arrow">
               <span className="icon is-small">
                  <i className="fas fa-arrow-left" />
               </span>
            </button>
         )}
         {page < maxPages && (
            <button onClick={() => properties.callback(page + 1)} className="button arrow">
               <span className="icon is-small">
                  <i className="fas fa-arrow-right" />
               </span>
            </button>
         )}
      </nav>
   );
}
