"use client";

import { useActionState, useState } from "react";
import type { Testimonial } from "@prisma/client";

import {
  addTestimonial,
  approveTestimonial,
  deleteTestimonial,
  hideTestimonial,
  toggleFeatured,
  type AddTestimonialState,
} from "@/actions/testimonials";
import { Button } from "@/components/ui/Button";

type TestimonialsTableProps = {
  pending: Testimonial[];
  published: Testimonial[];
  serviceOptions: string[];
};

const initialAddState: AddTestimonialState = { success: false };

export function TestimonialsTable({
  pending,
  published,
  serviceOptions,
}: TestimonialsTableProps) {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, isPending] = useActionState(addTestimonial, initialAddState);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-600">
          Admin-added reviews are published immediately. Approve patient submissions before they go live.
        </p>
        <Button type="button" variant="secondary" onClick={() => setShowForm((open) => !open)}>
          {showForm ? "Close Form" : "Add New Testimonial"}
        </Button>
      </div>

      {showForm ? (
        <form
          action={formAction}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
        >
          <h3 className="font-semibold text-slate-900">Add Testimonial</h3>

          <input
            name="patientName"
            required
            placeholder="Patient name"
            className="min-h-11 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
          />

          <select
            name="treatment"
            className="min-h-11 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
            defaultValue=""
          >
            <option value="">Treatment (optional)</option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <textarea
            name="content"
            required
            rows={4}
            placeholder="Review text"
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
          />

          <select
            name="rating"
            defaultValue="5"
            className="min-h-11 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} stars
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="featured" />
            Mark as featured
          </label>

          {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
          {state.success ? (
            <p className="text-sm text-green-700">Testimonial added ✓</p>
          ) : null}

          <Button type="submit" variant="secondary" disabled={isPending}>
            {isPending ? "Saving..." : "Save Testimonial"}
          </Button>
        </form>
      ) : null}

      <TableSection title="Pending Approval" items={pending} mode="pending" />
      <TableSection title="Published" items={published} mode="published" />
    </div>
  );
}

function TableSection({
  title,
  items,
  mode,
}: {
  title: string;
  items: Testimonial[];
  mode: "pending" | "published";
}) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 px-6 py-8 text-center text-slate-500">
          No testimonials in this section.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Treatment</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium">{item.patientName}</td>
                  <td className="px-4 py-3 text-slate-600">{item.treatment ?? "—"}</td>
                  <td className="px-4 py-3">{item.rating}/5</td>
                  <td className="max-w-xs px-4 py-3 text-slate-600">
                    {item.content.slice(0, 60)}
                    {item.content.length > 60 ? "…" : ""}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleFeatured.bind(null, item.id, !item.featured)}>
                      <button
                        type="submit"
                        className="text-sm font-medium text-[#0d6e6e] hover:underline"
                      >
                        {item.featured ? "★ Featured" : "☆ Not featured"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {mode === "pending" ? (
                        <form action={approveTestimonial.bind(null, item.id)}>
                          <button
                            type="submit"
                            className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800"
                          >
                            Approve
                          </button>
                        </form>
                      ) : (
                        <form action={hideTestimonial.bind(null, item.id)}>
                          <button
                            type="submit"
                            className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800"
                          >
                            Hide
                          </button>
                        </form>
                      )}
                      <form
                        action={deleteTestimonial.bind(null, item.id)}
                        onSubmit={(event) => {
                          if (!window.confirm("Delete this testimonial?")) {
                            event.preventDefault();
                          }
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
