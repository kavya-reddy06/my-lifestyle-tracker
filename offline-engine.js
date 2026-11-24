/**
 * Local Offline Engine & Canvas Fallback Renderer
 * Ensures charts and CSV/Spreadsheet exports work seamlessly even with zero internet connection.
 */
(function(global) {
  if (typeof global.Chart === 'undefined') {
    global.Chart = function(ctx, config) {
      const canvas = ctx && ctx.canvas ? ctx.canvas : ctx;
      if (!canvas || !canvas.getContext) return { destroy() {} };
      const c = canvas.getContext('2d');
      const parent = canvas.parentElement;
      const w = (parent ? parent.clientWidth : 340) || 340;
      const h = (parent ? parent.clientHeight : 210) || 210;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      c.scale(dpr, dpr);

      c.clearRect(0, 0, w, h);
      const padL = 36, padR = 16, padT = 28, padB = 28;
      const plotW = w - padL - padR;
      const plotH = h - padT - padB;

      c.strokeStyle = '#E2DDD2';
      c.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padT + (plotH * i) / 4;
        c.beginPath();
        c.moveTo(padL, y);
        c.lineTo(w - padR, y);
        c.stroke();
      }

      const labels = (config.data && config.data.labels) || [];
      const datasets = (config.data && config.data.datasets) || [];

      let lx = padL;
      c.font = '600 11px sans-serif';
      datasets.forEach((ds) => {
        const color = ds.borderColor || ds.backgroundColor || '#527366';
        c.fillStyle = color;
        c.fillRect(lx, 8, 10, 10);
        c.fillStyle = '#232A27';
        const lbl = ds.label || 'Series';
        c.fillText(lbl, lx + 14, 17);
        lx += c.measureText(lbl).width + 28;
      });

      datasets.forEach((ds, dsIdx) => {
        const vals = (ds.data || []).map(v => (v === null || v === undefined || isNaN(v)) ? null : Number(v));
        const nums = vals.filter(v => v !== null);
        if (!nums.length) return;
        let minV = 0;
        let maxV = Math.max(...nums, 1);
        if (config.options && config.options.scales && config.options.scales.y && config.options.scales.y.max) {
          maxV = config.options.scales.y.max;
        }
        const color = ds.borderColor || ds.backgroundColor || '#527366';
        const n = Math.max(labels.length, vals.length);

        if (config.type === 'bar') {
          const groupW = plotW / Math.max(1, n);
          const barW = Math.max(4, (groupW * 0.7) / Math.max(1, datasets.length));
          c.fillStyle = color;
          vals.forEach((v, i) => {
            if (v === null) return;
            const barH = ((v - minV) / (maxV - minV || 1)) * plotH;
            const bx = padL + i * groupW + groupW * 0.15 + dsIdx * barW;
            const by = padT + plotH - barH;
            c.fillRect(bx, by, barW - 2, barH);
          });
        } else {
          c.strokeStyle = color;
          c.fillStyle = color;
          c.lineWidth = 2;
          c.beginPath();
          let started = false;
          vals.forEach((v, i) => {
            if (v === null) return;
            const x = padL + (n > 1 ? (i / (n - 1)) * plotW : plotW / 2);
            const y = padT + plotH - ((v - minV) / (maxV - minV || 1)) * plotH;
            if (!started) { c.moveTo(x, y); started = true; }
            else { c.lineTo(x, y); }
          });
          c.stroke();
          vals.forEach((v, i) => {
            if (v === null) return;
            const x = padL + (n > 1 ? (i / (n - 1)) * plotW : plotW / 2);
            const y = padT + plotH - ((v - minV) / (maxV - minV || 1)) * plotH;
            c.beginPath();
            c.arc(x, y, 2.5, 0, Math.PI * 2);
            c.fill();
          });
        }
      });

      c.fillStyle = '#64706B';
      c.font = '10px sans-serif';
      const step = Math.max(1, Math.ceil(labels.length / 6));
      labels.forEach((lbl, i) => {
        if (i % step === 0 || i === labels.length - 1) {
          const x = padL + (labels.length > 1 ? (i / (labels.length - 1)) * plotW : plotW / 2);
          c.fillText(String(lbl), Math.max(2, x - 12), h - 8);
        }
      });

      return { destroy() {} };
    };
  }

  if (typeof global.XLSX === 'undefined') {
    global.XLSX = {
      utils: {
        book_new() { return { sheets: {} }; },
        json_to_sheet(rows) { return rows; },
        book_append_sheet(wb, sheet, name) { wb.sheets[name] = sheet; }
      },
      writeFile(wb, filename) {
        const firstSheetName = Object.keys(wb.sheets)[0];
        const rows = wb.sheets[firstSheetName] || [];
        if (!rows.length) return;
        const headers = Object.keys(rows[0]);
        const csvLines = [headers.join(',')];
        rows.forEach(r => {
          const line = headers.map(h => {
            const val = r[h] === null || r[h] === undefined ? '' : String(r[h]);
            return '"' + val.replace(/"/g, '""') + '"';
          }).join(',');
          csvLines.push(line);
        });
        const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.replace(/\.xlsx$/i, '_Offline.csv');
        a.click();
        URL.revokeObjectURL(url);
      }
    };
  }
})(window);
