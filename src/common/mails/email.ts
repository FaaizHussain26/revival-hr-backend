export interface Email {
  subject: string;
  toEmail: string[] | string;
  data: string;
  alternatives?: Array<{
    contentType: string;
    content: string;
  }>;
}


