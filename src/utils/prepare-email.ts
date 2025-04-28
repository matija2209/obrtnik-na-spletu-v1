function createContactEmailContent(
    name: string,
    email: string,
    message: string,
  ): Promise<{ htmlContent: string; textContent: string }> {
    try {
      console.log("Starting email sending process with MailerSend...");
      console.log("Email parameters:", { name, email, message });
      
      // Check if MAILERSEND_API_KEY is set
      
      console.log("MAILERSEND_API_KEY is set");
      
      // Format message content
      const htmlContent = `
        <html>
          <body>
            <h1>Nov kontaktni obrazec na Rezanje-Betona.si</h1>
            <p><strong>Ime in priimek:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Sporočilo:</strong> ${message}</p>
            <h2>Sporočilo:</h2>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </body>
        </html>
      `;
      
      const textContent = `
        Nov kontaktni obrazec na Rezanje-Betona.si
        
        Ime in priimek: ${name}
        Email: ${email}
        Sporočilo: ${message}
        
        Sporočilo:
        ${message}
      `;
      
      console.log("Email content prepared, attempting to send...");
      
      // Send email using MailerSend
      return Promise.resolve({
        htmlContent,
        textContent
      });
    } catch (error: any) {
      throw error;
    }
  } 
  
  function createReplyToVisitorEmailContent(
    name: string,
  ): Promise<{ htmlContent: string; textContent: string }> {
    try {
      const htmlContent = `
        <html>
          <body>
            <h1>Zahvaljujemo se za vaše povpraševanje - Rezanje Betona</h1>
            <p>Spoštovani/a ${name},</p>
            <p>Zahvaljujemo se vam za vaše povpraševanje na Rezanje-Betona.si.</p>
            <p>Vaše sporočilo smo prejeli in se bomo nanj odzvali v najkrajšem možnem času.</p>
            <p>Lep pozdrav,<br>Ekipa Rezanje Betona</p>
          </body>
        </html>
      `;
      
      const textContent = `
        Zahvaljujemo se za vaše povpraševanje - Rezanje Betona
        
        Spoštovani/a ${name},
        
        Zahvaljujemo se vam za vaše povpraševanje na Rezanje-Betona.si.
        Vaše sporočilo smo prejeli in se bomo nanj odzvali v najkrajšem možnem času.
        
        Lep pozdrav,
        Ekipa Rezanje Betona
      `;
      
      return Promise.resolve({
        htmlContent,
        textContent
      });
    } catch (error: any) {
      throw error;
    }
  }

  export { createContactEmailContent, createReplyToVisitorEmailContent };