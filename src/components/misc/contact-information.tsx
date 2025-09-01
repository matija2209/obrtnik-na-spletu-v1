import { Mail, Phone, MapPin } from 'lucide-react'
import React from 'react'

function ContactInformation() {
  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm mb-6">
                <h2 className="text-xl font-bold mb-6">
                  Kontaktni podatki
                </h2>
                
                <div className="mb-6">
                  <img 
                    src="/gallery/vas-koticek-razvajanje-salon-ambient-maribor.jpg"
                    alt="Vas kotiček razvajanje salon ambient Maribor"
                    width={600}
                    height={400}
                    className="w-full rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Telefon</p>
                      <a href="tel:068179728" className="text-primary hover:underline">
                        068 179 728
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">E-pošta</p>
                      <a href="mailto:matija@obrtniknaspletu.si" className="text-primary hover:underline">
                        matija@obrtniknaspletu.si
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Naslov</p>
                      <p className="text-muted-foreground">
                        Matija Žiberna, Računalniško svetovanje, s.p.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
  )
}

export default ContactInformation