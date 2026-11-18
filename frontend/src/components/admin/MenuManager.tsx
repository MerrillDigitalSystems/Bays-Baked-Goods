"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AvailabilityStatus } from "@/lib/availability";
import { MENU_KINDS, MENU_LABELS, type MenuKind } from "@/lib/menus";
import { LogoutButton } from "@/components/admin/LogoutButton";

export type AdminMenuProduct = {
  id: string;
  title: string;
  price: string;
  menu: MenuKind;
  groupId: string;
  status: AvailabilityStatus;
};

export type AdminMenuGroup = { id: string; menu: MenuKind; name: string };

const STATUS_LABELS: Record<AvailabilityStatus, string> = {
  available: "Live",
  hidden: "Hidden",
  scheduled: "Scheduled",
  expired: "Ended",
};

export function MenuManager({
  products: initialProducts,
  groups: initialGroups,
  customItemCount,
  updatedAt,
}: {
  products: AdminMenuProduct[];
  groups: AdminMenuGroup[];
  customItemCount: number;
  updatedAt: string;
}) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<MenuKind>("signature");
  const [products, setProducts] = useState(initialProducts);
  const [groups, setGroups] = useState(initialGroups);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const menuGroups = groups.filter((group) => group.menu === activeMenu);
  const menuProducts = products.filter((product) => product.menu === activeMenu);

  function changeMenu(menu: MenuKind) {
    if (menu === activeMenu) return;
    if (dirty && !window.confirm("Discard the unsaved arrangement changes on this menu?")) return;
    setActiveMenu(menu);
    setProducts(initialProducts);
    setGroups(initialGroups);
    setDirty(false);
    setError(null);
    setAnnouncement("");
  }

  function moveProduct(productId: string, groupId: string, direction: -1 | 1) {
    const groupProducts = products.filter(
      (product) => product.menu === activeMenu && product.groupId === groupId
    );
    const position = groupProducts.findIndex((product) => product.id === productId);
    const destination = groupProducts[position + direction];
    if (!destination) return;
    setProducts((current) => {
      const next = [...current];
      const from = next.findIndex((product) => product.id === productId);
      const to = next.findIndex((product) => product.id === destination.id);
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
    setDirty(true);
    setAnnouncement(
      `${groupProducts[position].title} moved to position ${position + direction + 1} of ${groupProducts.length}`
    );
  }

  function relocateProduct(sourceId: string, targetGroupId: string, targetId?: string) {
    if (sourceId === targetId) return;
    const source = products.find((product) => product.id === sourceId);
    if (!source) return;
    setProducts((current) => {
      const moving = current.find((product) => product.id === sourceId);
      if (!moving) return current;
      const next = current.filter((product) => product.id !== sourceId);
      let insertAt = targetId ? next.findIndex((product) => product.id === targetId) : -1;
      if (insertAt < 0) {
        insertAt = next.length;
        for (let index = next.length - 1; index >= 0; index -= 1) {
          if (next[index].menu === activeMenu && next[index].groupId === targetGroupId) {
            insertAt = index + 1;
            break;
          }
        }
      }
      next.splice(insertAt, 0, { ...moving, groupId: targetGroupId });
      return next;
    });
    setDirty(true);
    const groupName = groups.find((group) => group.id === targetGroupId)?.name ?? "group";
    setAnnouncement(`${source.title} moved to ${groupName}`);
  }

  function moveGroup(groupId: string, direction: -1 | 1) {
    const position = menuGroups.findIndex((group) => group.id === groupId);
    const destination = menuGroups[position + direction];
    if (!destination) return;
    setGroups((current) => {
      const next = [...current];
      const from = next.findIndex((group) => group.id === groupId);
      const to = next.findIndex((group) => group.id === destination.id);
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
    setDirty(true);
    setAnnouncement(`${menuGroups[position].name} moved to position ${position + direction + 1}`);
  }

  function addGroup() {
    const id = `group-${crypto.randomUUID()}`;
    setGroups((current) => [
      ...current,
      { id, menu: activeMenu, name: `New group ${menuGroups.length + 1}` },
    ]);
    setDirty(true);
  }

  function deleteGroup(groupId: string) {
    if (menuGroups.length === 1) {
      setError("Each menu needs at least one group. Rename it instead.");
      return;
    }
    const group = menuGroups.find((item) => item.id === groupId);
    if (!group || !window.confirm(`Delete "${group.name}"? Its items will move to another group.`)) return;
    const destination = menuGroups.find((item) => item.id !== groupId);
    if (!destination) return;
    setProducts((current) =>
      current.map((product) =>
        product.groupId === groupId ? { ...product, groupId: destination.id } : product
      )
    );
    setGroups((current) => current.filter((item) => item.id !== groupId));
    setDirty(true);
    setAnnouncement(`${group.name} deleted; its items moved to ${destination.name}`);
  }

  async function saveArrangement() {
    if (menuGroups.some((group) => !group.name.trim())) {
      setError("Every group needs a name.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menu: activeMenu,
          groups: menuGroups.map((group) => ({ id: group.id, name: group.name.trim() })),
          products: menuProducts.map((product) => ({ id: product.id, groupId: product.groupId })),
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Saving failed - try again.");
        return;
      }
      setDirty(false);
      setAnnouncement(`${MENU_LABELS[activeMenu]} arrangement saved`);
      router.refresh();
    } catch {
      setError("Network error - your arrangement was NOT saved. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl pb-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/55">Bay&apos;s admin</p>
          <h1 className="mt-2 font-serif text-3xl italic text-black sm:text-4xl">Hi Bailey 👋</h1>
          <p className="mt-2 text-sm text-black/60">
            Choose a menu, arrange its groups and items, then save. Item edits go live right away.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-7 flex flex-wrap gap-2" aria-label="Choose a menu to edit">
        {MENU_KINDS.map((menu) => (
          <button
            key={menu}
            type="button"
            aria-pressed={activeMenu === menu}
            onClick={() => changeMenu(menu)}
            className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
              activeMenu === menu ? "bg-[#1a1a1a] text-white" : "border border-black/10 bg-white text-black/65"
            }`}
          >
            {MENU_LABELS[menu]}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/admin/products/new?menu=${activeMenu}`}
          className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-6 py-3 text-base font-medium text-white shadow-xl transition hover:bg-black"
        >
          + Add to {MENU_LABELS[activeMenu]}
        </Link>
        <button
          type="button"
          onClick={addGroup}
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-base font-medium text-black transition hover:border-black/25"
        >
          + Add a group
        </button>
        <Link
          href="/admin/custom"
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/70 px-6 py-3 text-base font-medium text-black transition hover:border-black/25"
        >
          Edit custom pricing
        </Link>
      </div>

      <p className="mt-5 text-sm text-black/55">
        Drag the handle on a computer, or use the arrow buttons on any device. Use the group menu to move an
        item between groups.
      </p>

      <div className="mt-6 space-y-6">
        {menuGroups.map((group, groupIndex) => {
          const groupProducts = menuProducts.filter((product) => product.groupId === group.id);
          return (
            <section
              key={group.id}
              className="rounded-2xl border border-black/8 bg-white/65 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-5"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (draggedId) relocateProduct(draggedId, group.id);
                setDraggedId(null);
              }}
            >
              <div className="flex flex-wrap items-end gap-2">
                <label className="min-w-0 flex-1 text-xs font-medium uppercase tracking-wide text-black/50">
                  Group name
                  <input
                    type="text"
                    value={group.name}
                    maxLength={60}
                    onChange={(event) => {
                      const name = event.target.value;
                      setGroups((current) =>
                        current.map((item) => (item.id === group.id ? { ...item, name } : item))
                      );
                      setDirty(true);
                    }}
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-lg font-medium normal-case tracking-normal text-black"
                  />
                </label>
                <button
                  type="button"
                  aria-label={`Move ${group.name} group up`}
                  disabled={groupIndex === 0}
                  onClick={() => moveGroup(group.id, -1)}
                  className="min-h-11 min-w-11 rounded-xl border border-black/10 bg-white text-lg disabled:opacity-25"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={`Move ${group.name} group down`}
                  disabled={groupIndex === menuGroups.length - 1}
                  onClick={() => moveGroup(group.id, 1)}
                  className="min-h-11 min-w-11 rounded-xl border border-black/10 bg-white text-lg disabled:opacity-25"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => deleteGroup(group.id)}
                  className="min-h-11 rounded-xl border border-red-200 bg-white px-3 text-sm text-red-700"
                >
                  Delete group
                </button>
              </div>

              {groupProducts.length === 0 ? (
                <p className="mt-4 rounded-xl border border-dashed border-black/15 px-4 py-6 text-center text-sm text-black/50">
                  Empty group - drag an item here or move one with its group selector.
                </p>
              ) : (
                <ol className="mt-4 space-y-2">
                  {groupProducts.map((product, index) => (
                    <li
                      key={product.id}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        if (draggedId) relocateProduct(draggedId, group.id, product.id);
                        setDraggedId(null);
                      }}
                      className={`rounded-xl border bg-white p-3 ${draggedId === product.id ? "border-black/30 opacity-50" : "border-black/8"}`}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          draggable
                          aria-label={`Drag ${product.title} to reorder`}
                          onDragStart={(event) => {
                            setDraggedId(product.id);
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData("text/plain", product.id);
                          }}
                          onDragEnd={() => setDraggedId(null)}
                          className="min-h-11 min-w-8 cursor-grab touch-none select-none [-webkit-user-select:none] active:cursor-grabbing"
                          title="Drag to reorder"
                        >
                          <span aria-hidden className="tracking-widest text-black/35">⠿</span>
                        </button>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="font-medium text-black underline-offset-2 hover:underline"
                          >
                            {product.title}
                          </Link>
                          <p className="mt-0.5 text-sm text-black/55">{product.price}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-black/6 px-2.5 py-1 text-xs font-medium text-black/60">
                          {STATUS_LABELS[product.status]}
                        </span>
                        <button
                          type="button"
                          aria-label={`Move ${product.title} up`}
                          disabled={index === 0}
                          onClick={() => moveProduct(product.id, group.id, -1)}
                          className="min-h-11 min-w-11 rounded-lg border border-black/10 disabled:opacity-25"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          aria-label={`Move ${product.title} down`}
                          disabled={index === groupProducts.length - 1}
                          onClick={() => moveProduct(product.id, group.id, 1)}
                          className="min-h-11 min-w-11 rounded-lg border border-black/10 disabled:opacity-25"
                        >
                          ↓
                        </button>
                      </div>
                      <label className="mt-2 block pl-10 text-xs font-medium text-black/50">
                        Group for {product.title}
                        <select
                          value={product.groupId}
                          onChange={(event) => relocateProduct(product.id, event.target.value)}
                          className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-normal text-black"
                        >
                          {menuGroups.map((destination) => (
                            <option key={destination.id} value={destination.id}>{destination.name}</option>
                          ))}
                        </select>
                      </label>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          );
        })}
      </div>

      {menuProducts.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white/60 p-6 text-center text-black/60">
          This menu has no items yet. Add one above to get started.
        </p>
      ) : null}

      {error ? <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
      <p role="status" className="sr-only">{announcement}</p>
      <p className="mt-7 text-xs text-black/45">
        {customItemCount} &quot;Make Your Own&quot; rows · {updatedAt === "seed" ? "No edits saved yet - the site shows the original menu." : `Last saved ${new Date(updatedAt).toLocaleString("en-US")}`}
      </p>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/8 bg-[#f5f3ec]/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-3">
          <button
            type="button"
            onClick={saveArrangement}
            disabled={!dirty || saving}
            className="flex-1 rounded-full bg-[#1a1a1a] px-6 py-3.5 text-base font-medium text-white shadow-xl transition hover:bg-black disabled:opacity-40"
          >
            {saving ? "Saving…" : dirty ? `Save ${MENU_LABELS[activeMenu]} arrangement` : "Arrangement saved"}
          </button>
        </div>
      </div>
    </div>
  );
}
