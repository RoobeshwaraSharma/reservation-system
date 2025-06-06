import { Backbutton } from "@/components/BackButton";
import RoomForm from "./RoomForm";
import { getRoom } from "@/lib/quaries/getRoom";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { roomId } = await searchParams;

  if (roomId) {
    return {
      title: `Edit Room #${roomId}`,
    };
  } else {
    return {
      title: `New Room`,
    };
  }
}

export default async function RoomFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { roomId } = await searchParams;

  // New reservation
  if (!roomId) {
    return <RoomForm isEditable={true} />;
  }

  // Edit reservation
  if (roomId) {
    const rooms = await getRoom(parseInt(roomId));
    if (!rooms) {
      return (
        <>
          <h2 className="text-2xl mb-2">Room ID #{roomId} not found</h2>
          <Backbutton title="Go Back" variant="default" />
        </>
      );
    }

    return <RoomForm room={rooms} />;
  }

  return null;
}
