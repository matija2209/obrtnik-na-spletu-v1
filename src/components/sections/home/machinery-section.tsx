import { ContainedSection } from '@/components/layout/container-section'
import SectionHeading from '@/components/layout/section-heading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import React from 'react'
import { Media } from '@payload-types'
import { getImageUrl } from '@/utilities/getImageUrl'


interface MachinerySpecDetail {
  detail: string;
  id?: string | null;
}

interface MachinerySpec {
  specName: string;
  specDetails: MachinerySpecDetail[];
  id?: string | null;
}

interface MachineryItem {
  id: string;
  tabName: string;
  name: string;
  description?: string | null;
  image?: Media | number | null;
  specifications?: MachinerySpec[] | null;
  notes?: string | null;
}

interface MachineryProps {
  title?: string;
  description?: string;
  machinery: MachineryItem[];
}

function MachinerySection({ 
  title = "Naš Vozni Park", 
  description = "Ponudba gradbene mehanizacije za najem",
  machinery = []
}: MachineryProps) {
  // Use first machinery item as default tab if available
  const defaultTab = machinery.length > 0 ? machinery[0].id : "";

  return (
    <ContainedSection
      id="storitve"
      bgColor="bg-white"
      verticalPadding="2xl"
    >
      <SectionHeading>
        <SectionHeading.Title>{title}</SectionHeading.Title>
        <SectionHeading.Description>{description}</SectionHeading.Description>
      </SectionHeading>

      {machinery.length > 0 ? (
        <Tabs defaultValue={defaultTab} className="w-full mt-8">
          <TabsList>
            {machinery.map((machine) => (
              <TabsTrigger 
                key={machine.id} 
                value={machine.id}>
                {machine.tabName}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {machinery.map((machine) => (
            <TabsContent key={machine.id} value={machine.id} className="mt-6">
              <div className="bg-white rounded-lg flex flex-col md:flex-row gap-8">
                  {machine.image && (
                    <div className="w-full md:w-1/2 relative  h-full">
                      <Image 
                        src={typeof machine.image === 'object' ? getImageUrl(machine.image as Media) || '/placeholder-image.jpg' : '/placeholder-image.jpg'} 
                        alt={machine.name}
                        width={1000}
                        height={1000}
                        className="object-cover"

                      />
                    </div>
                  )}
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl font-bold mb-4">{machine.name}</h3>
                  {machine.description && <p className="text-gray-700 mb-6">{machine.description}</p>}
                  
                  {machine.specifications && machine.specifications.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {machine.specifications.map((spec, index) => (
                        <div key={index} className="mb-4">
                          <h4 className="font-bold text-lg mb-1">{spec.specName}</h4>
                          {spec.specDetails && spec.specDetails.length > 0 && (
                            <ul className="list-none space-y-1 mt-1">
                              {spec.specDetails.map((item, i) => (
                                <li key={i} className="text-gray-700">{item.detail}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {machine.notes && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-md">
                      <p className="font-medium">{machine.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12 text-white">
          <p>No machinery data available</p>
        </div>
      )}
    </ContainedSection>
  )
}

export default MachinerySection;