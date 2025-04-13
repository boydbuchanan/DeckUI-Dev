import { mockCreators } from "@mock/cms";

class SearchApiClass {
  
  async creators(
    category?: string, 
    interests?: string[], 
    page?: number
  ) {
    return mockCreators;
  }
}

export const search = new SearchApiClass();
export default search;
