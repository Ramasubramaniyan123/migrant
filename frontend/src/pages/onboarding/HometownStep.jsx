import Input from '@/components/common/Input';
/** Step 3 of onboarding: where the member grew up. */
export default function HometownStep({
  data,
  onChange
}) {
  return <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Hometown country" placeholder="India" value={data.hometownCountry} onChange={event => onChange({
        hometownCountry: event.target.value
      })} />
        <Input label="Hometown city" placeholder="Jaipur" value={data.hometownCity} onChange={event => onChange({
        hometownCity: event.target.value
      })} />
      </div>

      <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
        We only ever show your city, never your address — so you stay private while still finding
        people who share your roots.
      </p>
    </div>;
}
