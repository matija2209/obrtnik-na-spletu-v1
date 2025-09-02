import { ContactForm } from '@/components/contact-form';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import { getBusinessInfo, getTenantIdBySlug } from '@/lib/payload'; // Still needed for global business info
// import { getForm, getMediaImages, getOpeningHours } from '@/lib/payload'; // No longer needed with depth: 2
import { getBackgroundClass } from '@/utilities/getColorClasses';
import type { ContactBlock as ContactBlockVariant1, Form, Media, OpeningHour } from '@payload-types'
import React from 'react'
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { cookies } from 'next/headers';
// import { extractId, extractIds } from '@/utilities/extractIds'; // No longer needed with depth: 2

const dayNames = {
  monday: 'Montag',
  tuesday: 'Dienstag', 
  wednesday: 'Mittwoch',
  thursday: 'Donnerstag',
  friday: 'Freitag',
  saturday: 'Samstag',
  sunday: 'Sonntag'
};

type DayKey = keyof typeof dayNames;
const formatTime = (timeString: string) => {
  // Handle ISO date string format
  if (timeString.includes('T')) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }
  
  // Handle time-only format (HH:MM)
  if (timeString.includes(':')) {
    return timeString;
  }
  
  return timeString;
};

const formatOpeningHours = (openingHours: any[]) => {
  if (!openingHours || openingHours.length === 0) return null;
  
  return openingHours.map((schedule: OpeningHour) => (
    <div key={schedule.id} className="mb-4">
      {/* {schedule.name && (
        <h4 className="font-semibold text-primary-foreground mb-2">{schedule.name}</h4>
      )} */}
      {schedule.dailyHours?.map((dayGroup, groupIndex: number) => (
        <div key={dayGroup.id || `group-${groupIndex}`} className="mb-2">
          <div className="text-sm text-primary/90">
            {dayGroup.days.map((day: DayKey) => dayNames[day]).join(', ')}:
          </div>
          {dayGroup.timeSlots?.map((slot, slotIndex: number) => (
            <div key={slot.id || `slot-${slotIndex}`} className="ml-2 text-sm text-primary">
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              {slot.notes && <span className="italic ml-2">({slot.notes})</span>}
            </div>
          ))}
        </div>
      ))}
      {/* {schedule.notes && (
        <p className="text-xs text-primary-foreground/80 italic">{schedule.notes}</p>
      )} */}
    </div>
  ));
};
async function ContactBlockVariant1(props: ContactBlockVariant1) {
  const {
    idHref,
    bgc,
    isTransparent,
    title,
    form,
    subtitle,
    showEmail,
    showAddress,
    openingHours,
    showPhoneNumber,
    images
  } = props;
  
  const cookieStore = await cookies()
  const tenantId = cookieStore.get('current-tenant')?.value

  // With depth: 2, these are now populated objects, not IDs
  const backgroundImage = images && images.length > 0 ? images[0] as Media : null;
  const formData = form as Form | null; // Type assertion since it's now populated
  const openingHoursData = openingHours as OpeningHour[] | null; // Type assertion
  
  const backgroundClass = getBackgroundClass(bgc as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;
  
  // BusinessInfo still needs to be fetched as it's global data, not part of the block
  const tenantIdNumber = await getTenantIdBySlug(tenantId as string)
  const businessInfo = await getBusinessInfo(tenantIdNumber as number)
  const { email, phone, address } = businessInfo || { email: '', phone: '', address: '' };

  return (
    <ContainedSection
      id={idHref ?? "contact"}
      overlayClassName={overlayClass}
      maxWidth="7xl"
      verticalPadding="xl"
      padding="lg"
      backgroundImage={backgroundImage}
      backgroundImagePreferredSize="tablet"
      backgroundImageSizes="100vw"
      backgroundImagePriority={true}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - Title, subtitle, and opening hours */}
        <div className="flex-1">
          {(title || subtitle) && (
            <SectionHeading>
              {title && (
                <SectionHeading.Title size="hero" className="text-left text-primary">
                  {title}
                </SectionHeading.Title>
              )}
              {subtitle && (
                <SectionHeading.Description className="text-left text-primary">
                  {subtitle}
                </SectionHeading.Description>
              )}
            </SectionHeading>
          )}

          {/* Opening Hours */}
          {openingHoursData && openingHoursData.length > 0 && (
            <div className=''>
              {formatOpeningHours(openingHoursData)}
            </div>
          )}
        </div>

        {/* Right column - Contact information */}
        <div className="flex-1 space-y-4">
          {showPhoneNumber && (
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary backdrop-blur-sm rounded-full">
                <Phone className="w-5 h-5 text-primary-transparent" />
              </div>
              <div>
                <p className="text-sm text-primary/80 font-medium">Phone</p>
                <a 
                  href={`tel:${phone}`}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {phone}
                </a>
              </div>
            </div>
          )}

          {showEmail && (
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary backdrop-blur-sm rounded-full">
                <Mail className="w-5 h-5 text-primary-transparent" />
              </div>
              <div>
                <p className="text-sm text-primary font-medium">Email</p>
                <a 
                  href={`mailto:${email}`}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>
          )}

          {showAddress && (
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary backdrop-blur-sm rounded-full">
                <MapPin className="w-5 h-5 text-primary-transparent" />
              </div>
              <div>
                <p className="text-sm text-primary font-medium">Address</p>
                <p className="text-primary">{address}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Form */}
      {formData && (
        <div className="mt-12 bg-white p-10 rounded-3xl shadow-sm">
          <ContactForm form={formData} />
        </div>
      )}
    </ContainedSection>
  );
}

export default ContactBlockVariant1;