use std::fs;
use std::path::Path;

fn copy_dir_all(src: &Path, dst: &Path) -> std::io::Result<()> {
    fs::create_dir_all(dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        if ty.is_dir() {
            copy_dir_all(&entry.path(), &dst.join(entry.file_name()))?;
        } else {
            fs::copy(entry.path(), dst.join(entry.file_name()))?;
        }
    }
    Ok(())
}

fn sync_dist() {
    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").unwrap_or_else(|_| ".".into());
    let base = Path::new(&manifest_dir);
    let root = base.parent().unwrap_or(base);
    let dist = base.join("dist");

    // Re-run build script if frontend files change
    println!("cargo:rerun-if-changed={}", root.join("index.html").display());
    println!("cargo:rerun-if-changed={}", root.join("styles.css").display());
    println!("cargo:rerun-if-changed={}", root.join("manual.html").display());
    println!("cargo:rerun-if-changed={}", root.join("src").display());

    let _ = fs::remove_dir_all(&dist);
    let _ = fs::create_dir_all(&dist);
    let _ = fs::copy(root.join("index.html"), dist.join("index.html"));
    let _ = fs::copy(root.join("styles.css"), dist.join("styles.css"));
    let _ = fs::copy(root.join("manual.html"), dist.join("manual.html"));
    let _ = copy_dir_all(&root.join("src"), &dist.join("src"));
}

fn main() {
    sync_dist();
    tauri_build::build();
}
