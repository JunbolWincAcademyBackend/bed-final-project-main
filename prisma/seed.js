import { PrismaClient } from '@prisma/client';
import propertiesData from '../src/data/properties.json' with { type: 'json' };
import amenitiesData from '../src/data/amenities.json' with { type: 'json' };
import usersData from '../src/data/users.json' with { type: 'json' };
import bookingsData from '../src/data/bookings.json' with { type: 'json' };
import hostsData from '../src/data/hosts.json' with { type: 'json' };
import reviewsData from '../src/data/reviews.json' with { type: 'json' };

// Destructure arrays from the imported JSON data
const { properties } = propertiesData;
const { amenities } = amenitiesData;
const { users } = usersData;
const { bookings } = bookingsData;
const { hosts } = hostsData;
const { reviews } = reviewsData;

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function main() {
  // Seed users
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }

  // Seed hosts
  for (const host of hosts) {
    await prisma.host.upsert({
      where: { id: host.id },
      update: {},
      create: host,
    });
  }

  // Seed amenities
  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { id: amenity.id },
      update: {},
      create: amenity,
    });
  }

  // Seed properties
  for (const property of properties) {
    const { hostId, amenities: propertyAmenities, ...propertyData } = property;

    await prisma.property.upsert({
      where: { id: property.id },
      update: {},
      create: {
        ...propertyData,
        host: {
          connect: { id: hostId }, // Connect the property to the existing host
        },
        amenities: {
          connect: propertyAmenities?.map((amenityId) => ({ id: amenityId })) || [],
        },
      },
    });
  }

  // Seed reviews
  for (const review of reviews) {
    const { userId, propertyId, ...reviewData } = review;

    await prisma.review.upsert({
      where: { id: review.id },
      update: {},
      create: {
        ...reviewData,
        user: {
          connect: { id: userId }, // Connect the review to the existing user
        },
        property: {
          connect: { id: propertyId }, // Connect the review to the existing property
        },
      },
    });
  }

  // Seed bookings
  for (const booking of bookings) {
    const { userId, propertyId, ...bookingData } = booking;

    await prisma.booking.upsert({
      where: { id: booking.id },
      update: {},
      create: {
        ...bookingData,
        user: {
          connect: { id: userId }, // Connect the booking to the user with the corresponding `userId`
        },
        property: {
          connect: { id: propertyId }, // Connect the booking to the property with the corresponding `propertyId`
        },
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

/* Explanation of Changes:
1. The **seeding order** is crucial:
   - Users, Hosts, and Amenities are seeded first, as these are independent.
   - Properties are seeded after Amenities and Hosts, as they depend on both.
   - Reviews are seeded next since they depend on both Users and Properties.
   - Bookings are seeded last, as they depend on Users and Properties.

2. The `bookings` seeding logic:
   - Ensures `userId` and `propertyId` exist before connecting the `Booking` to its dependencies.

3. Removed redundant logic (e.g., duplicate `users` seeding block). 
*/

