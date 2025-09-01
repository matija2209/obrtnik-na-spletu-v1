# Product Form Block

A comprehensive product display and order form component for Payload CMS that integrates with the Products and Orders collections.

## Features

### Product Display
- **Product Gallery**: Image carousel with thumbnail navigation (configurable)
- **Product Information**: Title, pricing, ratings, availability, manufacturer details
- **Product Features**: Highlight key product features with checkmark icons
- **Technical Specifications**: Display product specs in a clean table format
- **Long Description**: Rich text product descriptions

### Order Form
- **Quantity Selector**: Interactive quantity input with +/- buttons
- **Customer Information**: Name, email, phone collection
- **Address Information**: Complete address form for delivery/installation
- **Order Summary**: Real-time price calculation and order details
- **Form Validation**: Client and server-side validation with error handling
- **Success Handling**: Automatic redirection after successful submission

### Configuration Options

The block provides extensive configuration options through the Payload admin:

#### Display Controls
- `showTitle` - Show/hide product title
- `showSku` - Show/hide SKU information
- `showManufacturer` - Show/hide manufacturer badge
- `showType` - Show/hide product type badge
- `showShortDescription` - Show/hide short description
- `showLongDescription` - Show/hide detailed description
- `showPricing` - Show/hide price information
- `showAvailability` - Show/hide stock status
- `showMountingInfo` - Show/hide mounting information
- `showTechnicalSpecs` - Show/hide technical specifications
- `showHighlights` - Show/hide product features
- `showMainImage` - Show/hide main product image
- `showGallery` - Enable/disable image gallery
- `showReviews` - Show/hide review information
- `showRating` - Show/hide star ratings
- `showOrderForm` - Show/hide the order form

#### Styling
- `colourScheme` - Choose from various color schemes (primary, secondary, accent, etc.)
- `ctaText` - Customize the call-to-action button text
- `idHref` - Set custom section ID for navigation

## Integration

### Collections Used
- **Products**: Main product data source
- **Orders**: Order creation and management
- **Customers**: Automatic customer creation from form submissions

### Actions
- `submitOrder`: Server action that handles form submission, validation, and order creation

### Components Structure
```
DefaultShopComponent/
├── index.tsx                    # Main component
├── components/
│   ├── product-components/      # Product display components
│   │   ├── ProductGallery.tsx
│   │   ├── ProductInfo.tsx
│   │   └── ProductFeatures.tsx
│   └── order/                   # Order form components
│       ├── OrderForm.tsx
│       ├── ProductSpecifications.tsx
│       └── [other form components]
```

## Usage

Add the Product Form block to any page and configure:

1. **Select a Product**: Choose from the Products collection
2. **Configure Display**: Toggle which product information to show
3. **Customize Styling**: Choose color scheme and CTA text
4. **Set Behavior**: Configure form submission and success handling

## Order Processing

When a customer submits the form:

1. **Validation**: Client and server-side validation using Zod
2. **Customer Handling**: Automatic customer creation or lookup by email
3. **Order Creation**: New order record with embedded customer data
4. **Notifications**: Console logging (email notifications can be added)
5. **Redirection**: Automatic redirect to thank you page

## Customization

The component is highly customizable through:
- Configuration options in Payload admin
- CSS classes for styling
- Component composition for layout changes
- Server actions for custom business logic

## Dependencies

- Payload CMS
- React Hook Form
- Zod validation
- Lucide React icons
- Tailwind CSS
- shadcn/ui components 