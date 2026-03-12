import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateMentorForm() {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Create Mentor</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <select id="title" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option>Select</option>
                        <option>Mr.</option>
                        <option>Ms.</option>
                        <option>Dr.</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sessionFee">Session Fee</Label>
                    <Input id="sessionFee" type="number" defaultValue={0} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input id="profession" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input id="qualification" />
                </div>
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" />
                </div>
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="bio">Subject / Bio</Label>
                    <textarea
                        id="bio"
                        placeholder="0/255"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="mentorImageUrl">Image URL</Label>
                    <Input id="mentorImageUrl" placeholder="https://.../mentor.webp" />
                </div>
            </div>
        </div>
    );
}
