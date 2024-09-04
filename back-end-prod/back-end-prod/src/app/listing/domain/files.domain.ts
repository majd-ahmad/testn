export class ListingFiles {
  id: string;
  fileName: string;
  filesSize: number;
  uploadDate: Date;
  listingId: string;
}

export class ListingImagesDomain extends ListingFiles {}
export class ListingPdfDomain extends ListingFiles {}
